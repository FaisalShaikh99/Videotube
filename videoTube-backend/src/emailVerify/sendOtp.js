import sgMail from '@sendgrid/mail'
import "dotenv/config"
import { ApiError } from "../utils/ApiError.js";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpMail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `VideoTube <${process.env.SMTP_FROM}>`, // Properly formatted sender
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

        const info = await sgMail.send(mailOptions);

        console.log(`✅ OTP Email successfully sent to ${email}`);
        console.log(`   Response Status: ${info[0].statusCode}`);

    } catch (error) {
        console.error("❌ Email Verification Failed:", error);

        let errorMessage = "Failed to send OTP email";

        if (error.response && error.response.body && error.response.body.errors) {
            // Extract SendGrid specific error message
            const sendGridErrors = error.response.body.errors.map(e => e.message).join(", ");
            errorMessage += `: ${sendGridErrors}`;
            console.error("SendGrid Errors:", sendGridErrors);
        } else if (error.message) {
            errorMessage += `: ${error.message}`;
        }

        throw new ApiError(500, errorMessage);
    }
}
