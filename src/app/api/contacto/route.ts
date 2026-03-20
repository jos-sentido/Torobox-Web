import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { nombre, telefono, correo, sucursal, tamano, plazo, mensaje, cotizacion } = await req.json();

    if (!nombre || !telefono || !correo) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Nueva Solicitud de Contacto</h1>
        </div>

        <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 140px;">Nombre</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Teléfono</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                <a href="tel:${telefono}" style="color: #dc2626; text-decoration: none;">${telefono}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Correo</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                <a href="mailto:${correo}" style="color: #dc2626; text-decoration: none;">${correo}</a>
              </td>
            </tr>
            ${sucursal ? `
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Sucursal</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${sucursal}</td>
            </tr>` : ""}
            ${tamano ? `
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Tamaño</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${tamano}</td>
            </tr>` : ""}
            ${plazo ? `
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Plazo</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${plazo}</td>
            </tr>` : ""}
          </table>

          ${cotizacion ? `
          <div style="margin-top: 16px; padding: 16px; background: #1a1a1a; color: #fff; border-radius: 8px;">
            <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #dc2626; font-weight: bold;">Cotización del Simulador</p>
            <p style="margin: 0; font-size: 14px;">${cotizacion}</p>
          </div>` : ""}

          ${mensaje ? `
          <div style="margin-top: 16px;">
            <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Mensaje:</p>
            <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #374151; white-space: pre-wrap;">${mensaje}</div>
          </div>` : ""}
        </div>

        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Enviado desde el formulario de contacto de torobox.mx
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"ToroBox Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT,
      replyTo: correo,
      subject: `Nueva solicitud: ${nombre}${sucursal ? ` — ${sucursal}` : ""}`,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
  }
}
