const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const { User, Order, Product, Shipment } = db

const userServices = {
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d',
      })
      return cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt
          .hash(req.body.password, 10)
          .then(hash =>
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: hash,
            })
          )
          .then(user => {
            const userData = user.toJSON()
            delete userData.password
            return cb(null, { data: { message: '註冊成功!', user: userData } })
          })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    User.findOne({ where: { id: req.user.id } })
      .then(user => {
        if (!user) throw new Error('User not found!')
        const userData = user.toJSON()
        delete userData.password
        return cb(null, userData)
      })
      .catch(err => cb(err))
  },
  getShipment: (req, cb) => {
    const reqUserId = req.user.id
    Shipment.findAll({ where: { userId: reqUserId } })
      .then(shipments => {
        if (!shipments) throw new Error('請建立貨運資料!')
        const shipmentData = shipments.map(shipment => shipment.toJSON())
        return cb(null, shipmentData)
      })
      .catch(err => cb(err))
  },
  getShipmentById: (req, cb) => {
    const reqUserId = req.user.id
    const id = req.params.id
    Shipment.findOne({ where: { userId: reqUserId, id } })
      .then(shipment => {
        if (!shipment) throw new Error('找不到貨運資料!')
        const shipmentData = shipment.toJSON()
        return cb(null, shipmentData)
      })
      .catch(err => cb(err))
  },
  postShipment: (req, cb) => {
    const reqUserId = req.user.id
    if (!req.body.address) throw new Error('請填寫地址資料')
    if (!req.body.city) throw new Error('請填寫城市')
    if (!req.body.country) throw new Error('請填寫國家')
    if (!req.body.state) throw new Error('請填寫貨運資料名稱')
    if (!req.body.zip_code) throw new Error('請選擇配送方式')
    Shipment.findOne({ where: { userId: reqUserId, state: req.body.state } })
      .then(shipment => {
        if (shipment) {
          throw new Error('請勿重複建立貨運資料!')
        } else {
          return Shipment.create({ ...req.body, userId: reqUserId })
        }
      })
      .then(shipment => {
        const shipmentData = shipment.toJSON()
        return cb(null, shipmentData)
      })
      .catch(err => cb(err))
  },
  patchShipment: (req, cb) => {
    const reqUserId = req.user.id
    const id = req.params.id
    Shipment.findOne({ where: { userId: reqUserId, state: req.body.state } })
      .then(shipment => {
        if (shipment) throw new Error('貨運名稱已存在，請確認!')
        return Shipment.findOne({ where: { userId: reqUserId, id } })
      })
      .then(shipment => {
        if (!shipment) throw new Error('找不到貨運資料!')
        return shipment.update({ ...req.body })
      })
      .then(shipment => {
        const shipmentData = shipment.toJSON()
        return cb(null, shipmentData)
      })
      .catch(err => cb(err))
  },
  deleteShipment: (req, cb) => {
    const reqUserId = req.user.id
    const id = req.params.id
    Order.findAll({
      where: { userId: reqUserId, shipmentId: id, status: { [db.Sequelize.Op.not]: 'completed' } },
    })
      .then(orders => {
        console.log(orders)
        if (orders.length > 0) throw new Error('已有訂單，無法刪除!')
        return Shipment.findOne({ where: { userId: reqUserId, id } })
      })
      .then(shipment => {
        if (!shipment) throw new Error('找不到貨運資料!')
        return shipment.destroy()
      })
      .then(shipment => {
        const shipmentData = shipment.toJSON()
        return cb(null, shipmentData)
      })
      .catch(err => cb(err))
  },
  getOrder: (req, cb) => {
    const reqUserId = req.user.id
    return Promise.all([
      Order.findAll({
        where: { userId: reqUserId },
        attributes: ['id', 'sub_total', 'total', 'status', 'comments'],
        include: [
          { model: Shipment, attributes: ['address', 'city', 'state', 'country', 'zip_code'] },
          {
            model: Product,
            as: 'OrderItemsProduct',
            attributes: ['name', 'price', 'weight', 'roast', 'image'],
            through: {
              attributes: ['qty'],
            },
          },
        ],
        raw: true,
      }),
    ])
      .then(([orders]) => {
        const target = 'OrderItemsProduct.OrderItems.orderId'

        const arrayIndex = []
        const data = []

        orders.map(order => {
          const index = arrayIndex.indexOf(order[target])

          if (index !== -1) {
            data[index].OrderItemsProduct.push({
              name: order['OrderItemsProduct.name'],
              price: order['OrderItemsProduct.price'],
              weight: order['OrderItemsProduct.weight'],
              roast: order['OrderItemsProduct.roast'],
              image: order['OrderItemsProduct.image'],
              qty: order['OrderItemsProduct.OrderItems.qty'],
            })
          } else {
            data.push({
              id: order.id,
              sub_total: order.sub_total,
              total: order.total,
              status: order.status,
              comments: order.comments,
              Shipment: [
                {
                  address: order['Shipment.address'],
                  city: order['Shipment.city'],
                  state: order['Shipment.state'],
                  country: order['Shipment.country'],
                  zip_code: order['Shipment.zip_code'],
                },
              ],
              OrderItemsProduct: [
                {
                  name: order['OrderItemsProduct.name'],
                  price: order['OrderItemsProduct.price'],
                  weight: order['OrderItemsProduct.weight'],
                  roast: order['OrderItemsProduct.roast'],
                  image: order['OrderItemsProduct.image'],
                  qty: order['OrderItemsProduct.OrderItems.qty'],
                },
              ],
            })
            arrayIndex.push(order[target])
          }
          return order
        })
        cb(null, [data])
      })
      .catch(err => cb(err))
  },
  getOrderById: (req, cb) => {
    const reqUserId = req.user.id
    const id = req.params.id
    return Promise.all([
      Order.findAll({
        where: { userId: reqUserId, id },
        attributes: ['id', 'sub_total', 'total', 'status', 'comments'],
        include: [
          { model: Shipment, attributes: ['address', 'city', 'state', 'country', 'zip_code'] },
          {
            model: Product,
            as: 'OrderItemsProduct',
            attributes: ['name', 'price', 'weight', 'roast', 'image'],
            through: {
              attributes: ['qty'],
            },
          },
        ],
        raw: true,
      }),
    ])
      .then(([orders]) => {
        const data = []

        orders.map((order, index) => {
          console.log(index)
          if (index !== 0) {
            console.log(data)
            data[0].OrderItemsProduct.push({
              name: order['OrderItemsProduct.name'],
              price: order['OrderItemsProduct.price'],
              weight: order['OrderItemsProduct.weight'],
              roast: order['OrderItemsProduct.roast'],
              image: order['OrderItemsProduct.image'],
              qty: order['OrderItemsProduct.OrderItems.qty'],
            })
          } else {
            data.push({
              id: order.id,
              sub_total: order.sub_total,
              total: order.total,
              status: order.status,
              comments: order.comments,
              Shipment: [
                {
                  address: order['Shipment.address'],
                  city: order['Shipment.city'],
                  state: order['Shipment.state'],
                  country: order['Shipment.country'],
                  zip_code: order['Shipment.zip_code'],
                },
              ],
              OrderItemsProduct: [
                {
                  name: order['OrderItemsProduct.name'],
                  price: order['OrderItemsProduct.price'],
                  weight: order['OrderItemsProduct.weight'],
                  roast: order['OrderItemsProduct.roast'],
                  image: order['OrderItemsProduct.image'],
                  qty: order['OrderItemsProduct.OrderItems.qty'],
                },
              ],
            })
          }
          return order
        })
        cb(null, [data])
      })
      .catch(err => cb(err))
  },
}

module.exports = userServices
