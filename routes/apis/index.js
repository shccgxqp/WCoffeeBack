const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const upload = require('../../middleware/multer')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')
const { admin, auth, user } = require('./modules')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/auth', auth)
router.use('/user', user)

router.get('/products/:id', productController.getProductById)
router.get('/products', productController.getProducts)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', upload.single('image'), userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
