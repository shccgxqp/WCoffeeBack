const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')

const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')

const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/products/:id', productController.getProductById)
router.get('/products', productController.getProducts)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.get('/user/orders/:id', authenticated, userController.getOrderById)
router.get('/user/orders', authenticated, userController.getOrder)
router.post('/user/orders', authenticated, userController.postOrder)
router.patch('/user/orders/:id', authenticated, userController.patchOrderById)

router.get('/user/shipment/:id', authenticated, userController.getShipmentById)
router.get('/user/shipment', authenticated, userController.getShipment)
router.post('/user/shipment', authenticated, userController.postShipment)
router.patch('/user/shipment/:id', authenticated, userController.patchShipmentById)
router.delete('/user/shipment/:id', authenticated, userController.deleteShipmentById)

router.get('/user', authenticated, userController.getUser)

router.use('/', apiErrorHandler)

module.exports = router
