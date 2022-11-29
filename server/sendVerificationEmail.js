const nodemailer = require("nodemailer")

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD
  }
})

transporter.verify().then(console.log).catch(console.error)

function sendVerificationEmail(name, email, verifyToken) {
  console.log(verifyToken);


  transporter.sendMail({
    from: '"Marco von Chessy" <marco.zillgen23@gmail.com>',
    to: email,
    subject: "Verify for Chessy",
    text: "Your Code is: " + verifyToken + ".",
    html: "Your Code is: <b>" + verifyToken + "</b>"
  }).then(console.log).catch(console.error)
}

module.exports = sendVerificationEmail;
