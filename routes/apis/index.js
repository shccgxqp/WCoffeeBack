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

router.get('/users/order/:Id', authenticated, userController.getOrderById)
router.get('/users/order', authenticated, userController.getOrder)
// router.get('/users/:id',authenticated, userController.getUsers)
// router.get('/users', authenticated, userController.getUsers)

router.use('/', apiErrorHandler)

module.exports = router
