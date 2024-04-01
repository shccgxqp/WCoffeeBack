const fs = require('fs')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const db = require('../models')
const { User } = db
const authServices = {
  sendEmail: async (req, cb) => {
    const { subject, content } = req.body
    const user = await User.findOne({
      where: { id: req.params.id },
      raw: true,
      attributes: ['id', 'email', 'first_name', 'last_name'],
    })

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
      username: user.last_name + user.first_name,
      message: '您好您好，測試測試，請別當真 ',
      content: content || '',
    })
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: subject,
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
