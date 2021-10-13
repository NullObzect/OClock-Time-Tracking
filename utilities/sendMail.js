/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const REFRESH_TOKEN = '1//04DyhM1M3yCp6CgYIARAAGAQSNwF-L9Ir3SnMXU37hzjOe08cr1-r_51-iWh9HQEP3EPRlhVOPodemUroae4UOyijth9Yh25bCmk'

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_LINK)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(toMail, subject, textMessage, htmlMessage) {
  try {
    const accessTokens = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ebwork005@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessTokens,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const results = await transport.sendMail({
      from: 'Oclock ✉️ <ebwork005@gmail.com>',
      to: toMail,
      subject,
      text: textMessage,
      html: htmlMessage,
    })
    return results
  } catch (err) {
    console.log('send mail---', err)
  }
}

module.exports = sendMail
