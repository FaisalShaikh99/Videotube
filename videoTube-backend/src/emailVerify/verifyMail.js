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

    // ===== Mail Transporter (Generic SMTP / Brevo) =====
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    const mailConfiguration = {
      from: `"VideoTube" <${process.env.SMTP_USER}>`,
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
