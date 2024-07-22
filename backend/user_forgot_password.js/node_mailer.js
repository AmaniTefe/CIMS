import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "henokbasa1221@gmail.com",
    pass: "jaue xxgm umww efjx",
  },
});

export default transporter;