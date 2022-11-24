const nodemailer = require("nodemailer");

require("dotenv").config();
const { EMAIL, EMAIL_PASSWORD } = process.env;

async function sendVerificationEmail(name, email, verifyToken) {
  console.log(verifyToken);
}

module.exports = sendVerificationEmail;
