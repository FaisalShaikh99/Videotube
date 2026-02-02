import sgMail from "@sendgrid/mail";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import { ApiError } from "../utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const verifyMail = async (token, email) => {
  try {
    // ===== Read Email Template =====
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf-8"
    );

    const template = handlebars.compile(emailTemplateSource);

    //  FRONTEND URL
    const verifyUrl = `${process.env.FRONTEND_URL}/verifying-email/${encodeURIComponent(token)}`;

    const htmlToSend = template({
      verifyUrl,
    });

    // ===== SendGrid Mail =====
    const mailConfiguration = {
      from: `VideoTube <${process.env.SMTP_FROM}>`, // Properly formatted sender
      to: email,
      subject: "Verify your VideoTube email",
      html: htmlToSend,
    };

    console.log(`ATTEMPTING TO SEND VERIFICATION EMAIL to ${email}...`);
    await sgMail.send(mailConfiguration);
    console.log(`✅ Verification Email successfully sent to ${email}`);

  } catch (error) {
    console.error("❌ Email Verification Failed:", error);

    let errorMessage = "Failed to send verification email";

    if (error.response && error.response.body && error.response.body.errors) {
      const sendGridErrors = error.response.body.errors.map(e => e.message).join(", ");
      errorMessage += `: ${sendGridErrors}`;
      console.error("SendGrid Errors:", sendGridErrors);
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    throw new ApiError(500, errorMessage);
  }
};
