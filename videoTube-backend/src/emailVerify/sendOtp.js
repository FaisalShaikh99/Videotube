import nodemailer from 'nodemailer'
import "dotenv/config"

export const sendOtpMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
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