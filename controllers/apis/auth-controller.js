const authServices = require('../../services/auth-services')
const authController = {
  sendEmail: async (req, res, next) => {
    authServices.sendEmail(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', message: '發送成功', data })
    )
  },
}

module.exports = authController
