import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { OrderData, OrderStatusType } from "@/types";

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || "587", 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const from = process.env.SMTP_FROM || "Arcfumes <orders@arcfumes.com>";
const supportEmail = process.env.SUPPORT_EMAIL || "orders@arcfumes.com";

const hasSmtpConfig = Boolean(
  host &&
  user &&
  pass &&
  !pass.includes("your-") &&
  !pass.includes("demo-")
);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  : null;

// Helper to log email dispatch to EmailLog table
async function logEmailAttempt(
  orderId: string | undefined,
  recipient: string,
  subject: string,
  success: boolean,
  errorMessage?: string
) {
  try {
    await prisma.emailLog.create({
      data: {
        orderId: orderId || null,
        recipient,
        subject,
        status: success ? "SENT" : "FAILED",
        errorMessage: errorMessage || null,
      },
    });
  } catch (error) {
    console.warn("Could not record EmailLog entry:", error);
  }
}

// 1. Send Order Confirmation Email
export async function sendOrderConfirmationEmail(order: OrderData): Promise<boolean> {
  const subject = `Arcfumes Order Confirmation — #${order.orderNumber}`;
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0eae1;">
          <strong style="color: #0d0c0a; font-size: 14px;">${item.productName}</strong>
          <div style="color: #7d6e5d; font-size: 12px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0eae1; text-align: right; color: #0d0c0a; font-weight: 600;">
          PKR ${(item.unitPrice * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 40px 0; background-color: #faf8f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0d0c0a;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e8e2d8; border-radius: 4px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 30px; background-color: #0d0c0a;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 0.25em; color: #ffffff; text-transform: lowercase;">a r c f u m e s</h1>
                    <p style="margin: 8px 0 0; font-size: 11px; letter-spacing: 0.15em; color: #9e8c78; text-transform: uppercase;">Niche Luxury Fragrance</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 36px;">
                    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 400; color: #0d0c0a;">Thank you for your order, ${order.customerName}.</h2>
                    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #5e574f;">
                      We have received your order <strong>#${order.orderNumber}</strong>. Our artisans are preparing your signature fragrance for dispatch.
                    </p>

                    <!-- Order Summary Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border: 1px solid #f0eae1; border-radius: 4px; padding: 16px;">
                      <tr>
                        <td style="font-size: 12px; color: #7d6e5d; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 12px;" colspan="2">Order Details</td>
                      </tr>
                      ${itemsHtml}
                      <tr>
                        <td style="padding-top: 12px; color: #5e574f; font-size: 14px;">Subtotal</td>
                        <td style="padding-top: 12px; text-align: right; color: #0d0c0a; font-size: 14px;">PKR ${order.subtotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px; color: #5e574f; font-size: 14px;">Shipping</td>
                        <td style="padding-top: 8px; text-align: right; color: #9e8c78; font-size: 14px; font-weight: 500;">Free</td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; border-top: 1px solid #f0eae1; color: #0d0c0a; font-size: 16px; font-weight: 600;">Total</td>
                        <td style="padding-top: 12px; border-top: 1px solid #f0eae1; text-align: right; color: #0d0c0a; font-size: 18px; font-weight: 700;">PKR ${order.totalAmount.toLocaleString()}</td>
                      </tr>
                    </table>

                    <!-- Shipping Address -->
                    <div style="margin-bottom: 30px; padding: 16px; background-color: #faf8f4; border-radius: 4px;">
                      <p style="margin: 0 0 8px; font-size: 12px; color: #7d6e5d; text-transform: uppercase; letter-spacing: 0.1em;">Delivery Address</p>
                      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #0d0c0a;">
                        ${order.customerName}<br />
                        ${order.address}<br />
                        ${order.city}, ${order.province} ${order.postalCode || ""}<br />
                        Phone: ${order.phone}
                      </p>
                    </div>

                    <!-- CTA -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/track-order?order=${order.orderNumber}&query=${encodeURIComponent(order.email)}"
                             style="display: inline-block; background-color: #9e8c78; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">
                            Track Your Order
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 24px; background-color: #f7f4ed; border-top: 1px solid #eae3d8; font-size: 12px; color: #7d6e5d;">
                    Questions? Reach our concierge at <a href="mailto:${supportEmail}" style="color: #0d0c0a; text-decoration: underline;">${supportEmail}</a>
                    <br />
                    © 2026 Arcfumes. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (!transporter) {
    console.log(`[SMTP DEV MODE] Simulated Order Confirmation Email to ${order.email}:`, subject);
    await logEmailAttempt(order.id, order.email, subject, true, "Dev simulation mode");
    return true;
  }

  try {
    await transporter.sendMail({
      from,
      to: order.email,
      subject,
      html,
    });
    await logEmailAttempt(order.id, order.email, subject, true);
    return true;
  } catch (error: any) {
    console.error("Failed to send order confirmation email:", error);
    await logEmailAttempt(order.id, order.email, subject, false, error.message);
    return false;
  }
}

// 2. Send Order Status Change Email
export async function sendOrderStatusEmail(
  order: OrderData,
  newStatus: OrderStatusType,
  comment?: string
): Promise<boolean> {
  const subjects: Record<OrderStatusType, string> = {
    PENDING: `Update on your Arcfumes Order #${order.orderNumber}`,
    CONFIRMED: `Your Arcfumes Order Has Been Confirmed — #${order.orderNumber}`,
    DISPATCHED: `Your Arcfumes Order Has Been Dispatched — #${order.orderNumber}`,
    COMPLETED: `Your Arcfumes Order Has Been Completed — #${order.orderNumber}`,
    CANCELLED: `Your Arcfumes Order Has Been Cancelled — #${order.orderNumber}`,
    RETURNED: `Your Arcfumes Order Has Been Marked as Returned — #${order.orderNumber}`,
  };

  const subject = subjects[newStatus] || `Order #${order.orderNumber} Status Updated`;

  const trackingSnippet =
    order.trackingNumber && newStatus === "DISPATCHED"
      ? `<div style="margin: 16px 0; padding: 12px; background: #eef4fb; border-radius: 4px; border: 1px solid #cbdbee;">
           <strong>Tracking Number:</strong> ${order.trackingNumber}
         </div>`
      : "";

  const commentSnippet = comment
    ? `<div style="margin: 16px 0; padding: 12px; background: #faf8f4; border-radius: 4px; border: 1px solid #eae3d8; font-style: italic;">
         <strong>Note from Arcfumes Concierge:</strong> "${comment}"
       </div>`
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>${subject}</title></head>
      <body style="margin: 0; padding: 40px 0; background-color: #faf8f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0d0c0a;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e8e2d8; border-radius: 4px; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 30px; background-color: #0d0c0a;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 0.25em; color: #ffffff; text-transform: lowercase;">a r c f u m e s</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 36px;">
                    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 400; color: #0d0c0a;">Status Update: ${newStatus}</h2>
                    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #5e574f;">
                      Dear ${order.customerName}, the status of your order <strong>#${order.orderNumber}</strong> is now <strong>${newStatus}</strong>.
                    </p>
                    ${trackingSnippet}
                    ${commentSnippet}
                    <div style="margin-top: 30px; text-align: center;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/track-order?order=${order.orderNumber}&query=${encodeURIComponent(order.email)}"
                         style="display: inline-block; background-color: #9e8c78; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">
                        View Live Status
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (!transporter) {
    console.log(`[SMTP DEV MODE] Simulated Status Email (${newStatus}) to ${order.email}:`, subject);
    await logEmailAttempt(order.id, order.email, subject, true, "Dev simulation mode");
    return true;
  }

  try {
    await transporter.sendMail({
      from,
      to: order.email,
      subject,
      html,
    });
    await logEmailAttempt(order.id, order.email, subject, true);
    return true;
  } catch (error: any) {
    console.error("Failed to send status update email:", error);
    await logEmailAttempt(order.id, order.email, subject, false, error.message);
    return false;
  }
}

// 3. Send Contact Enquiry Notification
export async function sendContactNotification(
  name: string,
  email: string,
  phone: string | undefined,
  subject: string,
  message: string
): Promise<boolean> {
  const mailSubject = `New Arcfumes Contact Enquiry: ${subject}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0d0c0a;">
      <h2>New Contact Message from Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border: none; border-top: 1px solid #eae3d8; margin: 16px 0;" />
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[SMTP DEV MODE] Contact Notification to ${supportEmail}:`, mailSubject);
    return true;
  }

  try {
    await transporter.sendMail({
      from,
      to: supportEmail,
      subject: mailSubject,
      html,
      replyTo: email,
    });
    return true;
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
    return false;
  }
}
