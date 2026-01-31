import nodemailer from 'nodemailer'
import "dotenv/config"
import { ApiError } from "../utils/ApiError.js";

export const sendOtpMail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

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
            `
        }

        console.log(`ATTEMPTING TO SEND OTP to ${email}...`);
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP Email successfully sent to ${email}`);
        console.log(`   MessageID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);

    } catch (error) {
        console.error("❌ Email Verification Failed:", error);
        throw new ApiError(500, "Failed to send OTP email: " + error.message);
    }
}
