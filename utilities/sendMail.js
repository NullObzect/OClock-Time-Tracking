/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'tusherahmedctg7@gmail.com', // generated ethereal user
    pass: 'mfkrwbnmndmvcdub', // generated ethereal password
  },
});
async function sendMail(toMail, subject, textMessage, htmlMessage) {
  // send mail with defined transport object
  const results = await transporter.sendMail({
    from: 'Oclock ✉️ <ebwork005@gmail.com>',
    to: toMail,
    subject,
    text: textMessage,
    html: htmlMessage,
  })
  return results
}

module.exports = sendMail
