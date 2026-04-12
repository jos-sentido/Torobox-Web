import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
}

async function createGhlContact(
  nombre: string,
  telefono: string,
  correo: string,
  sucursal: string,
  tamano: string,
  utm: UtmData,
) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return;

  // Build origen_del_lead from UTMs
  const origenParts = [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean);
  const origenDelLead = origenParts.length > 0
    ? origenParts.join(" / ")
    : "sitio web / orgánico";

  // Split nombre into first/last
  const parts = nombre.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  const body: Record<string, unknown> = {
    locationId,
    firstName,
    lastName,
    email: correo,
    phone: telefono,
    source: "sitio web torobox.mx",
    customFields: [
      { id: "zCKGssV2MZkjp4N9199L", value: origenDelLead },
      { id: "7WhwsrEt1rNwVRSZsuwU", value: sucursal },
      { id: "hVZRW1n3EO8P6GapXYhm", value: tamano },
    ],
  };

  // Add UTM custom fields only if they have values
  if (utm.utm_source) {
    (body.customFields as Array<{id: string; value: string}>).push({ id: "KaDrxlpdWJZyErfwJQZ8", value: utm.utm_source });
  }
  if (utm.utm_medium) {
    (body.customFields as Array<{id: string; value: string}>).push({ id: "pU4wPTalEz8OqjbGeG0V", value: utm.utm_medium });
  }
  if (utm.utm_campaign) {
    (body.customFields as Array<{id: string; value: string}>).push({ id: "QMPXq4nsZNEcnp2sBSL4", value: utm.utm_campaign });
  }
  if (utm.gclid) {
    (body.customFields as Array<{id: string; value: string}>).push({ id: "n859ohT5iyKVOiVPwn2H", value: utm.gclid });
  }

  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("GHL upsert error:", res.status, err);
      return;
    }

    const data = await res.json();
    const contactId = data.contact?.id;
    console.log("GHL contact upserted:", contactId);

    // Create opportunity in pipeline
    if (contactId) {
      await createGhlOpportunity(contactId, nombre, sucursal, tamano, apiKey);
    }
  } catch (err) {
    console.error("GHL API call failed:", err);
  }
}

async function createGhlOpportunity(
  contactId: string,
  nombre: string,
  sucursal: string,
  tamano: string,
  apiKey: string,
) {
  const pipelineId = process.env.GHL_PIPELINE_ID;
  const stageId = process.env.GHL_STAGE_NUEVO_LEAD;
  if (!pipelineId || !stageId) return;

  const title = `${nombre.trim()} — ${sucursal || "Sin sucursal"}${tamano ? ` · ${tamano}` : ""}`;

  try {
    const res = await fetch("https://services.leadconnectorhq.com/opportunities/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
        pipelineId,
        pipelineStageId: stageId,
        locationId: process.env.GHL_LOCATION_ID,
        contactId,
        name: title,
        status: "open",
        source: "sitio web torobox.mx",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("GHL opportunity error:", res.status, err);
    } else {
      const data = await res.json();
      console.log("GHL opportunity created:", data.opportunity?.id);
    }
  } catch (err) {
    console.error("GHL opportunity creation failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, telefono, correo, sucursal, tamano, plazo, mensaje, cotizacion, utm = {} } = await req.json();

    if (!nombre || !telefono || !correo) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const safeNombre = escapeHtml(nombre);
    const safeTelefono = escapeHtml(telefono);
    const safeCorreo = escapeHtml(correo);
    const safeSucursal = sucursal ? escapeHtml(sucursal) : "";
    const safeTamano = tamano ? escapeHtml(tamano) : "";
    const safePlazo = plazo ? escapeHtml(plazo) : "";
    const safeMensaje = mensaje ? escapeHtml(mensaje) : "";
    const safeCotizacion = cotizacion ? escapeHtml(cotizacion) : "";

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const detalles = [
      { label: "Sucursal", value: safeSucursal },
      { label: "Tamaño", value: safeTamano },
      { label: "Plazo", value: safePlazo },
    ].filter(d => d.value);

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; border-radius: 12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">TOROBOX</h1>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px;">Mini Bodegas</p>
                  </td>
                  <td align="right" valign="middle">
                    <div style="background-color: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Nueva solicitud</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Red accent line -->
          <tr><td style="background-color: #dc2626; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

          <!-- Contact info card -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 40px 24px;">
              <p style="margin: 0 0 20px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Datos del cliente</p>

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; font-weight: 500;">Nombre</p>
                    <p style="margin: 0; font-size: 18px; color: #111827; font-weight: 700;">${safeNombre}</p>
                  </td>
                </tr>
              </table>

              <!-- Phone & Email row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 12px;">
                    <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; font-weight: 500;">Telefono</p>
                    <a href="tel:${safeTelefono}" style="display: inline-block; margin-top: 4px; font-size: 15px; color: #1a1a1a; font-weight: 600; text-decoration: none; background-color: #f3f4f6; padding: 8px 14px; border-radius: 8px;">${safeTelefono}</a>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 12px;">
                    <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; font-weight: 500;">Correo</p>
                    <a href="mailto:${safeCorreo}" style="display: inline-block; margin-top: 4px; font-size: 14px; color: #dc2626; font-weight: 600; text-decoration: none; background-color: #fef2f2; padding: 8px 14px; border-radius: 8px; word-break: break-all;">${safeCorreo}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${detalles.length > 0 ? `
          <!-- Separator -->
          <tr><td style="background-color: #ffffff; padding: 0 40px;"><div style="border-top: 1px solid #e5e7eb;"></div></td></tr>

          <!-- Details -->
          <tr>
            <td style="background-color: #ffffff; padding: 24px 40px;">
              <p style="margin: 0 0 16px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Detalles de interes</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${detalles.map(d => `
                <tr>
                  <td style="padding: 10px 16px; background-color: #f9fafb; border-bottom: 2px solid #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">${d.label}</td>
                        <td align="right" style="font-size: 15px; color: #111827; font-weight: 700;">${d.value}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join("")}
              </table>
            </td>
          </tr>
          ` : ""}

          ${safeCotizacion ? `
          <!-- Cotizacion -->
          <tr>
            <td style="background-color: #ffffff; padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 10px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #dc2626; font-weight: 700;">Cotizacion del simulador</p>
                    <p style="margin: 0; font-size: 14px; color: #ffffff; line-height: 1.5;">${safeCotizacion}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}

          ${safeMensaje ? `
          <!-- Message -->
          <tr>
            <td style="background-color: #ffffff; padding: 0 40px 32px;">
              <p style="margin: 0 0 10px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Mensaje</p>
              <div style="background-color: #f9fafb; border-left: 3px solid #dc2626; padding: 16px 20px; border-radius: 0 8px 8px 0; font-size: 14px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${safeMensaje}</div>
            </td>
          </tr>
          ` : ""}

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 20px 40px; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Formulario de contacto &middot; torobox.mx</p>
                  </td>
                  <td align="right">
                    <a href="https://torobox.mx" style="font-size: 12px; color: #dc2626; text-decoration: none; font-weight: 600;">Ir al sitio</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Create/upsert contact in GHL (non-blocking — email still sends if GHL fails)
    await createGhlContact(nombre, telefono, correo, safeSucursal, safeTamano, utm as UtmData);

    const subject = `${safeNombre} - Solicitud de bodega${safeSucursal ? ` (${safeSucursal})` : ""}`;

    // Send to admin
    await transporter.sendMail({
      from: `"ToroBox" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT,
      replyTo: correo,
      subject,
      html: htmlBody,
    });

    // Send to branch email if a sucursal was selected
    const sucursalEmails: Record<string, string> = {
      "Av. Vallarta": "ventasvallarta@torobox.com.mx",
      "Zona Real": "karen.diaz@torobox.com.mx",
      "Punto Sur": "ventaspuntosur@torobox.com.mx",
      "Bucerías": "ventasbucerias@torobox.com.mx",
    };

    const branchEmail = safeSucursal ? sucursalEmails[sucursal] : undefined;
    if (branchEmail) {
      await transporter.sendMail({
        from: `"ToroBox" <${process.env.SMTP_USER}>`,
        to: branchEmail,
        replyTo: correo,
        subject,
        html: htmlBody,
      }).catch((err: unknown) => {
        console.error("Error enviando correo a sucursal:", err);
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
  }
}
