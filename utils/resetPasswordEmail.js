import { MailerSend } from "mailersend";


const mailer = new MailerSend({ apiKey: process.env.MAILERSEND_PASS });

export const resetPasswordEmail = async ({ to, subject, html }) => {
  try {
    await mailer.email.send({
      from: process.env.MAILERSEND_EMAIL,
      to: [to],
      subject,
      html,
    });
    console.log("Email sent successfully via API!");
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};

export default resetPasswordEmail;
