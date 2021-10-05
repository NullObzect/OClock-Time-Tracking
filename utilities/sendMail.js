/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const REFRESH_TOKEN = '1//04gUJrqMRyKdqCgYIARAAGAQSNwF-L9IrvhMJERPanWJihEF2WzrGolm25gC7IO0S3Xg1VG52hhOyc7xjlSSu5K6G5OKhdcxWvfs'

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
    });

    const results = await transport.sendMail({
      from: 'Oclock ✉️ <ebwork005@mail.com>',
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
