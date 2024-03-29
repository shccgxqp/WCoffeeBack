const fs = require('fs')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')

const authServices = {
  sendEmail: async (req, cb) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    })
    await transporter.verify()

    const source = fs.readFileSync('templates/emailTemplate.hbs', 'utf-8')
    const template = handlebars.compile(source)
    const html = template({
      username: req.user.last_name + req.user.first_name,
      message: '以下為測試郵件內容',
      content: req.body.content || '',
    })
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: req.user.email,
      subject: '伺服器測試信件',
      text: '測試郵件文字',
      html: html,
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        cb(error)
      } else {
        cb(null, info)
      }
    })
  },
}

module.exports = authServices
