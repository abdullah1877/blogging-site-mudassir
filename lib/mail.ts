import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendContactReply(
  to: string,
  name: string,
  subject: string,
  message: string
) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2d5f3f 0%, #3a7d52 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You For Reaching Out</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #1f2937; margin: 0 0 20px 0;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for contacting us. We have received your message and will get back to you shortly.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #2d5f3f; margin: 20px 0;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;"><strong>Your Message Summary:</strong></p>
            <p style="font-size: 14px; color: #1f2937; margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="font-size: 14px; color: #1f2937; margin: 0; word-break: break-word;">${message.substring(0, 200)}...</p>
          </div>
          <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0;">
            We appreciate your interest and will respond as soon as possible.
          </p>
        </div>
        <div style="background: #2d5f3f; padding: 20px; color: white; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Technical Blog. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `Re: ${subject}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('[v0] Email sent successfully to', to);
  } catch (error) {
    console.error('[v0] Error sending email:', error);
    throw error;
  }
}

export async function sendAdminNotification(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2d5f3f 0%, #3a7d52 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #2d5f3f; width: 100px;">Name:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #2d5f3f;">Email:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #2d5f3f;">Subject:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.subject}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 0; font-weight: bold; color: #2d5f3f;">Message:</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; color: #1f2937; white-space: pre-wrap; word-break: break-word;">${contactData.message}</td>
            </tr>
          </table>
        </div>
        <div style="background: #2d5f3f; padding: 20px; color: white; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">New contact submission from your website</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact: ${contactData.subject}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('[v0] Admin notification sent');
  } catch (error) {
    console.error('[v0] Error sending admin notification:', error);
    throw error;
  }
}
