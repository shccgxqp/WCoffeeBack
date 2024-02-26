const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')

const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/api-auth')

router.get('/products/:id', productController.getProductById)
router.get('/products', productController.getProducts)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.get('/user/order/:id', authenticated, userController.getOrderById)
router.get('/user/order', authenticated, userController.getOrder)

router.get('/user/shipment/:id', authenticated, userController.getShipmentById)
router.get('/user/shipment', authenticated, userController.getShipment)
router.post('/user/shipment', authenticated, userController.postShipment)
router.patch('/user/shipment/:id', authenticated, userController.patchShipmentById)
router.delete('/user/shipment/:id', authenticated, userController.deleteShipmentById)

router.get('/user', authenticated, userController.getUser)

router.use('/', apiErrorHandler)

module.exports = router
