const express = require('express')
const router = express.Router()
const paymentController = require('../../../controllers/apis/payment-controller')
const { authenticated } = require('../../../middleware/api-auth')
const upload = require('../../../middleware/multer')
const { createSesDecrypt } = require('../../../helpers/encrypt-helpers')

router.get('/payment/:orderId', authenticated, paymentController.newebpay_payment)
router.post('/notify', paymentController.newebpay_notify)

module.exports = router
