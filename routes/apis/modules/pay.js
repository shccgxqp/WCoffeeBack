const express = require('express')
const router = express.Router()
const paymentController = require('../../../controllers/apis/payment-controller')
const { authenticated } = require('../../../middleware/api-auth')

router.get('/payment/:orderId', authenticated, paymentController.newebpay_payment)
router.post('/callback_notify', paymentController.newebpay_notify)

module.exports = router
