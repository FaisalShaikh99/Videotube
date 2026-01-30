import nodemailer from 'nodemailer'
import "dotenv/config"

export const sendOtpMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    const mailOptions = {
        from: `"VideoTube" <${process.env.SMTP_USER}>`, // Improved from field
        to: email,
        subject: "Password resent OTP",
        html: `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 10 minutes.</p>`
    }

    try {
        console.log("Configuring Nodemailer with:", {
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: process.env.SMTP_PORT || 587,
            user: process.env.SMTP_USER ? "Set" : "Missing",
            pass: process.env.SMTP_PASS ? "Set" : "Missing"
        });

        await transporter.verify();
        console.log("SMTP Connection Viable");

        await transporter.sendMail(mailOptions);
        console.log(`OTP Email sent to ${email}`);
    } catch (error) {
        console.error("Email Verification Failed:", error);
        throw error; // Let controller handle it
    }
}