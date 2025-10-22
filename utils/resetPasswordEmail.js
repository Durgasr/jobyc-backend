import nodemailer from "nodemailer";

const resetPasswordEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587
    requireTLS: true,
    auth: {
      user: process.env.JOBYC_SMTP_MAIL,
      pass: process.env.JOBYC_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Jobyc Careers" <${process.env.JOBYC_SMTP_MAIL}>`,
    to,
    subject,
    html,
  });
};

export default resetPasswordEmail;
