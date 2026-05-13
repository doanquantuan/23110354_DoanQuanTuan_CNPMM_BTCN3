import nodemailer from "nodemailer";

require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.verify();

  await transporter.sendMail({
    from: process.env.MAIL_USER,

    to: email,

    subject: "Verify your account",

    html: `
         <h2>Your OTP Code</h2>

         <h1>${otp}</h1>

         <p>
            OTP expires in 5 minutes
         </p>
      `,
  });
};
