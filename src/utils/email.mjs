import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  //create transport which will send email to user
  //the tech used is mail-trap

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  //definne the email options
  const emailOptions = {
    from: "Cineflix support<support@cineflix.com>",
    to: option.email,
    subject: option.subject,
    text: email.message,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
