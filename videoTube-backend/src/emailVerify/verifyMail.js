// ========================================
// PRODUCTION-READY EMAIL SERVICE
// ========================================
// Non-blocking, async-safe email delivery
// Works perfectly on Render and other platforms

import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// TRANSPORTER SINGLETON
// ========================================
// Create once, reuse everywhere (more efficient)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // Use TLS (587), not SSL (465)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // ⚠️ REMOVED CONNECTION TIMEOUTS - Let Nodemailer handle it
      pool: true, // Use connection pooling for better performance
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return transporter;
};

// ========================================
// VERIFICATION EMAIL (NON-BLOCKING)
// ========================================
export const sendVerificationEmail = (token, email) => {
  // 🚀 FIRE AND FORGET - Returns immediately
  setImmediate(async () => {
    try {
      const emailTemplateSource = fs.readFileSync(
        path.join(__dirname, "template.hbs"),
        "utf-8"
      );

      const template = handlebars.compile(emailTemplateSource);
      const verifyUrl = `${process.env.FRONTEND_URL}/verifying-email/${encodeURIComponent(token)}`;
      const htmlToSend = template({ verifyUrl });

      const mailOptions = {
        from: `"VideoTube" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your VideoTube email",
        html: htmlToSend,
      };

      const transport = getTransporter();
      await transport.sendMail(mailOptions);

      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      // 🔥 CRITICAL: Log but don't throw - email failure shouldn't break auth
      console.error(`❌ Failed to send verification email to ${email}:`, error.message);
      // Optional: Add to a retry queue here
    }
  });
};

// ========================================
// OTP EMAIL (NON-BLOCKING)
// ========================================
export const sendOtpEmail = (email, otp) => {
  // 🚀 FIRE AND FORGET - Returns immediately
  setImmediate(async () => {
    try {
      const mailOptions = {
        from: `"VideoTube" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset OTP - VideoTube",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Password Reset Request</h2>
            <p>Your OTP for password reset is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #6366f1; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #6b7280;">This OTP is valid for <strong>10 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      };

      const transport = getTransporter();
      await transport.sendMail(mailOptions);

      console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
      // 🔥 CRITICAL: Log but don't throw
      console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
      // Optional: Add to a retry queue here
    }
  });
};

// ========================================
// GRACEFUL SHUTDOWN
// ========================================
export const closeEmailService = async () => {
  if (transporter) {
    await transporter.close();
    console.log("📧 Email service closed");
  }
};

// ========================================
// TESTING HELPER (Optional)
// ========================================
export const testEmailConnection = async () => {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log("✅ SMTP connection verified");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    return false;
  }
};