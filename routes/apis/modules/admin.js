const express = require('express')
const router = express.Router()

const upload = require('../../../middleware/multer')
const adminController = require('../../../controllers/apis/admin-controller')

router.get('/products/create', adminController.createProducts)
router.get('/products', adminController.getProducts)
router.get('/products/:id', adminController.getProductById)
router.post('/products', upload.single('image'), adminController.postProduct)
router.patch('/products/:id', upload.single('image'), adminController.patchProductById)
router.delete('/products/:id', adminController.deleteProductById)

router.get('/orders', adminController.getOrders)
router.get('/orders/:id', adminController.getOrderById)
router.patch('/orders/:id', adminController.patchOrderById)
router.patch('/orders/cancel/:id', adminController.patchOrderCancelById)
router.delete('/orders/:id', adminController.deleteOrderById)

router.get('/users', adminController.getUsers)
router.get('/users/:id', adminController.getUserById)
router.patch('/users/:id', upload.single('image'), adminController.patchUsers)

module.exports = router
