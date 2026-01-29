import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import { ApiError } from "../utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
  try {
    // ===== Read Email Template =====
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf-8"
    );

    const template = handlebars.compile(emailTemplateSource);

    //  FRONTEND URL yahi se aa raha hai
    const verifyUrl = `${process.env.FRONTEND_URL}/verifying-email/${encodeURIComponent(token)}`;

    const htmlToSend = template({
      verifyUrl,
    });

    // ===== Mail Transporter =====
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // Changed from 465 -> 587 (TLS is more reliable on cloud servers)
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // Timeout settings (increased for safety)
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    const mailConfiguration = {
      from: `"VideoTube" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your VideoTube email",
      html: htmlToSend,
    };

    await transporter.verify(); // Verify connection config
    await transporter.sendMail(mailConfiguration);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to send verification email");
  }
};
