const paymentServices = require('../../services/payment-services')

const paymentController = {
  newebpay_payment: (req, res, next) => {
    paymentServices.newebpay_payment(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  newebpay_notify: (req, res, next) => {
    paymentServices.newebpay_notify(req, (err, data) => (err ? next(err) : res.end()))
  },
}

module.exports = paymentController
