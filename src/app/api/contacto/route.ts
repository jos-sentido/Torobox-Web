import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/C8HeFtWI5ohKrH5SpKub/webhook-trigger/86aff748-93a8-486d-9b11-4bdec3fca6c3";

async function sendToGhlWebhook(data: {
  nombre: string;
  telefono: string;
  correo: string;
  sucursal: string;
  tamano: string;
  piso: string;
  plazo: string;
  mensaje: string;
  cotizacion: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  origen_del_lead: string;
}) {
  try {
    const res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("GHL webhook error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("GHL webhook failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, telefono, correo, sucursal, tamano, piso, plazo, mensaje, cotizacion, utm = {} } = await req.json();

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

    // Build origen_del_lead from UTMs
    const origenParts = [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean);
    const origenDelLead = origenParts.length > 0
      ? origenParts.join(" / ")
      : "sitio web / orgánico";

    // Send to GHL via webhook (no env vars needed)
    await sendToGhlWebhook({
      nombre,
      telefono,
      correo,
      sucursal: sucursal || "",
      tamano: tamano || "",
      piso: piso || "",
      plazo: plazo || "",
      mensaje: mensaje || "",
      cotizacion: cotizacion || "",
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      utm_content: utm.utm_content || "",
      utm_term: utm.utm_term || "",
      gclid: utm.gclid || "",
      origen_del_lead: origenDelLead,
    });

    // Send email notifications
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safePiso = piso ? escapeHtml(piso) : "";

    const detalles = [
      { label: "Sucursal", value: safeSucursal },
      { label: "Tamaño", value: safeTamano },
      { label: "Planta", value: safePiso },
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

    const subject = `${safeNombre} - Solicitud de bodega${safeSucursal ? ` (${safeSucursal})` : ""}`;

    // MODO PRUEBAS: solo enviar a jos@sentido.mx
    await transporter.sendMail({
      from: `"ToroBox" <${process.env.SMTP_USER}>`,
      to: "jos@sentido.mx",
      replyTo: correo,
      subject,
      html: htmlBody,
    });

    // TODO: REACTIVAR DESPUÉS DE PRUEBAS
    // // Send to admin
    // await transporter.sendMail({
    //   from: `"ToroBox" <${process.env.SMTP_USER}>`,
    //   to: process.env.CONTACT_RECIPIENT,
    //   replyTo: correo,
    //   subject,
    //   html: htmlBody,
    // });
    //
    // // Send to branch email if a sucursal was selected
    // const sucursalEmails: Record<string, string> = {
    //   "Av. Vallarta": "ventasvallarta@torobox.com.mx",
    //   "Zona Real": "karen.diaz@torobox.com.mx",
    //   "Punto Sur": "ventaspuntosur@torobox.com.mx",
    //   "Bucerías": "ventasbucerias@torobox.com.mx",
    // };
    //
    // const branchEmail = safeSucursal ? sucursalEmails[sucursal] : undefined;
    // if (branchEmail) {
    //   await transporter.sendMail({
    //     from: `"ToroBox" <${process.env.SMTP_USER}>`,
    //     to: branchEmail,
    //     replyTo: correo,
    //     subject,
    //     html: htmlBody,
    //   }).catch((err: unknown) => {
    //     console.error("Error enviando correo a sucursal:", err);
    //   });
    // }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en API contacto:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
