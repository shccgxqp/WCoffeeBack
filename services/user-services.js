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
  getOrder: (req, cb) => {
    const reqUserId = req.user.id
    return Promise.all([
      Order.findAll({
        where: { userId: reqUserId },
        attributes: ['sub_total', 'total', 'status', 'comments'],
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
    return Promise.all([
      Order.findAll({
        where: { userId: reqUserId },
        attributes: ['sub_total', 'total', 'status', 'comments'],
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
}

module.exports = userServices
