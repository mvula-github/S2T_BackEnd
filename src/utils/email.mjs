import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  //create transport which will send email to user
  //the tech used is mail-trap

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
    tls: {
      rejectUnauthorized: false, // correct property name
    },
    connectionTimeout: 1000000,
  });

  console.log(
    process.env.EMAIL_HOST,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  );

  //definne the email options
  const emailOptions = {
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
