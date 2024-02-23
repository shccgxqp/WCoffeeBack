const userServices = require('../../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getOrder: (req, res, next) => {
    userServices.getOrder(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getOrderById: (req, res, next) => {
    userServices.getOrderById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
}

module.exports = userController
