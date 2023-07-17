const nodemailer = require("nodemailer");

 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSFOREMAIL, // generated ethereal password
    },
  });

  transporter.verify().then(() => {
    console.log('Listo para enviar correos')
  });

  module.exports = {transporter}