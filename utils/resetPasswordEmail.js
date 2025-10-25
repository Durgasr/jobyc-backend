import nodemailer from "nodemailer";

const resetPasswordEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
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
