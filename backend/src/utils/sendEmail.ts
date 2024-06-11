import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import {
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USER,
} from "../config/constants";

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  htmlFilePath: string;
  replacements: {
    subject: string;
    heading: string;
    message: string;
    resetLink: string;
    senderName: string;
  };
}

function getHtmlTemplate(
  filePath: string,
  replacements: Record<string, string>
): string {
  const templateSource = fs.readFileSync(path.resolve(filePath), "utf-8");
  const template = handlebars.compile(templateSource);
  return template(replacements);
}

async function sendEmail(options: MailOptions) {
  const { to, subject, htmlFilePath, replacements } = options;
  const html = getHtmlTemplate(htmlFilePath, replacements);

  const mailOptions = {
    from: `"Your Name" <${MAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendEmail;
