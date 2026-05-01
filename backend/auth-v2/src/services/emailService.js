const nodemailer = require("nodemailer");

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return transporter;
}

async function sendOtpEmail(to, code, purpose = "verification") {
  const subject = `Your ${purpose} code: ${code}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2>Your One-Time Code</h2>
      <p>Use the code below to complete your ${purpose} request:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:6px;background:#f4f4f4;padding:16px;text-align:center;border-radius:8px">${code}</p>
      <p>This code expires in ${Math.floor((parseInt(process.env.OTP_TTL_SECONDS || "600", 10)) / 60)} minutes.</p>
      <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore the email.</p>
    </div>`;
  return getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text: `Your ${purpose} code is ${code}. It expires in 10 minutes.`,
  });
}

module.exports = { sendOtpEmail };