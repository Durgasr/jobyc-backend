import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  view,
  name,
  designation,
  companyName
) => {
  try {
    let htmlContent;
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.JOBYC_SMTP_MAIL,
        pass: process.env.JOBYC_SMTP_PASS,
      },
    });

    console.log("Email")

    if (view === "profile") {
      htmlContent = `
    <p>Hi <b>${name}</b>,</p>
    <p>A recruiter has viewed your profile for <b>${designation}</b> position at <b>${companyName}</b>.</p>
  `;
    } else {
      htmlContent = `<p>Hi <b>${name}</b>, </p>
      <p>A recruiter has just viewed your resume for <b>${designation}</b> position at <b>${companyName}</b>.</p>`;
    }

    // Email options
    const mailOptions = {
      from: `"Jobyc Careers" <${process.env.JOBYC_SMTP_MAIL}>`,
      to,
      subject,
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
