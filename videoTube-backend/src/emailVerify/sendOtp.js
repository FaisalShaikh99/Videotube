import nodemailer from 'nodemailer'
import "dotenv/config"

export const sendOtpMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        family: 4, // Force IPv4
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