const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

transporter
  .verify()
  .then((info) => console.log("Email status: " + info))
  .catch(console.error);

function sendVerificationEmail(name, email, verifyToken) {
  transporter
    .sendMail({
      from: '"Marco von Chessy" <marco.zillgen23@gmail.com>',
      to: email,
      subject: "Verify for Chessy",
      text: "Hey " + name + ", your Code is: " + verifyToken + ".",
      html: "Hey " + name + ", your Code is: <b>" + verifyToken + "</b>",
    })
    .catch(console.error);
}

module.exports = sendVerificationEmail;
