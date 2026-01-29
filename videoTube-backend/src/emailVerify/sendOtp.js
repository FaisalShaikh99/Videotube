import nodemailer from 'nodemailer'
import "dotenv/config"

export const sendOtpMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use built-in Gmail service (Handles Port/Secure automatically)
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        // Debug settings
        logger: true,
        debug: true
    })

    const mailOptions = {
        from: `"VideoTube" <${process.env.MAIL_USER}>`, // Improved from field
        to: email,
        subject: "Password resent OTP",
        html: `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 10 minutes.</p>`
    }

    await transporter.verify();
    await transporter.sendMail(mailOptions)
}