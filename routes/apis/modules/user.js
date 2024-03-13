const express = require('express')
const router = express.Router()

const upload = require('../../../middleware/multer')
const userController = require('../../../controllers/apis/user-controller')
const { authenticated } = require('../../../middleware/api-auth')

router.get('/logout', userController.logout)
router.get('/checkLogin', authenticated, userController.checkLogin)

router.get('/edit', authenticated, userController.getUserEdit)
router.put('/edit', authenticated, userController.putUserEdit)

router.get('/orders/:id', authenticated, userController.getOrderById)
router.get('/orders', authenticated, userController.getOrder)
router.post('/orders', authenticated, userController.postOrder)
router.patch('/orders/:id', authenticated, userController.patchOrderById)

router.get('/shipment/:id', authenticated, userController.getShipmentById)
router.get('/shipment', authenticated, userController.getShipment)
router.post('/shipment', upload.single('image'), authenticated, userController.postShipment)
router.patch(
  '/shipment/:id',
  upload.single('image'),
  authenticated,
  userController.patchShipmentById
)
router.delete('/shipment/:id', authenticated, userController.deleteShipmentById)

router.get('/', authenticated, userController.getUser)
module.exports = router
