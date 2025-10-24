import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

console.log("API Key:", process.env.MAILERSEND_API_KEY);


export const resetPasswordEmail = async ({ to, subject, html }) => {
  const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL, process.env.MAILERSEND_FROM_NAME);
  const recipients = [new Recipient(to, "Recipient")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html);

  try {
    await mailerSend.email.send(emailParams);
    console.log("✅ Email sent successfully via MailerSend API!");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};


export default resetPasswordEmail