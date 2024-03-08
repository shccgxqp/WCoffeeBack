const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const { User, Order, OrderItem, Product, Shipment } = db
const { processOrders } = require('../helpers/process-helpers')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d',
      })

      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  signUp: async (req, cb) => {
    try {
      const {
        last_name,
        first_name,
        password,
        password_check,
        email,
        phone,
        level,
        birthday,
        carrier_code,
        country,
        city,
      } = req.body

      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) throw new Error('1|請輸入正確的信箱格式!')
      if (email < 6) throw new Error('2|密碼長度不足6位，請確認!')
      if (password !== password_check) throw new Error('2|密碼輸入有誤，請確認!')
      if (last_name === '') throw new Error('3|姓氏名字輸入有誤，請確認!')
      if (first_name === '') throw new Error('4|名字輸入有誤，請確認!')
      if (!/^[0-9]+$/.test(phone) || phone.length !== 10)
        throw new Error('5|手機號碼輸入有誤，請確認!')
      if (country === '') throw new Error('6|國家輸入有誤，請確認!')
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(birthday) ||
        birthday >= new Date().toISOString().split('T')[0]
      )
        throw new Error('7|生日輸入有誤，請確認!')

      const existingUser = await User.findOne({ where: { email: req.body.email } })
      if (existingUser) throw new Error('信箱已被註冊!')

      const hash = await bcrypt.hash(req.body.password, 10)
      const userData = {
        last_name: last_name,
        first_name: first_name,
        email: email,
        password: hash,
        phone: phone,
        level: level || 0,
        birthday: birthday,
        country: country || null,
        city: city || null,
        carrier_code: carrier_code,
        isAdmin: false,
      }

      const user = await User.create(userData)
      const data = user.toJSON()
      delete data.password

      cb(null, { data: { message: '註冊成功!', user: data } })
    } catch (err) {
      cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        include: [
          {
            model: Shipment,
            as: 'Shipments',
          },
        ],
      })
      if (!user) throw new Error('User not found!')
      const userData = user.toJSON()
      delete userData.password
      cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  getShipment: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const shipments = await Shipment.findAll({ where: { userId: reqUserId } })
      if (!shipments || shipments.length === 0) {
        const error = new Error('請建立配送資料!')
        error.status = 401
        throw error
      }

      const shipmentData = shipments.map(shipment => shipment.toJSON())
      cb(null, shipmentData)
    } catch (err) {
      cb(err)
    }
  },
  getShipmentById: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id
      const shipment = await Shipment.findOne({ where: { userId: reqUserId, id } })
      if (!shipment) {
        const error = new Error('找不到貨運資料!')
        error.status = 401
        throw error
      }
      const shipmentData = shipment.toJSON()
      cb(null, shipmentData)
    } catch (err) {
      cb(err)
    }
  },
  postShipment: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const { address, city, country, state, zip_code } = req.body
      console.log(address, city, country, state, zip_code)
      if (!address || !city || !country || !state || !zip_code) {
        const error = new Error('請填寫所有必要的地址資料!')
        error.status = 401
        throw error
      }

      const existingShipment = await Shipment.findOne({ where: { userId: reqUserId, state } })
      if (existingShipment) {
        const error = new Error('配送名稱已存在，請確認!')
        error.status = 401
        throw error
      }

      const shipment = await Shipment.create({
        address,
        city,
        country,
        state,
        zip_code,
        userId: reqUserId,
      })

      cb(null, shipment.toJSON())
    } catch (error) {
      cb(error)
    }
  },
  patchShipment: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id
      const { state, ...updateData } = req.body

      const shipment = await Shipment.findOne({ where: { userId: reqUserId, id } })

      if (!shipment) throw new Error('找不到貨運資料!')

      if (state && state !== shipment.state) {
        const existingShipment = await Shipment.findOne({ where: { userId: reqUserId, state } })
        if (existingShipment) throw new Error('貨運名稱已存在，請確認!')
      }

      await shipment.update(updateData)
      cb(null, shipment.toJSON())
    } catch (error) {
      cb(error)
    }
  },
  deleteShipment: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id

      const orders = await Order.findAll({
        where: {
          userId: reqUserId,
          shipmentId: id,
          status: { [db.Sequelize.Op.not]: 'completed' },
        },
      })
      if (orders.length > 0) throw new Error('已有訂單，無法刪除!')

      const shipment = await Shipment.findOne({ where: { userId: reqUserId, id } })
      if (!shipment) throw new Error('找不到貨運資料!')

      await shipment.destroy()

      cb(null, shipment.toJSON())
    } catch (error) {
      cb(error)
    }
  },
  getOrder: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 2

      const totalCount = await Order.count({ where: { userId: reqUserId } })

      const orders = await Order.findAll({
        where: { userId: reqUserId },
        attributes: ['id', 'sub_total', 'total', 'status', 'comments', 'updated_at', 'created_at'],
        include: [
          { model: Shipment, attributes: ['address', 'city', 'state', 'country', 'zip_code'] },
          {
            model: Product,
            as: 'OrderItemsProduct',
            attributes: ['name', 'price', 'weight', 'roast', 'image'],
            through: { attributes: ['qty'] },
          },
        ],
        limit,
        offset: (page - 1) * limit,
        raw: true,
      })

      const data = processOrders(orders)

      cb(null, { orders: data, totalCount })
    } catch (error) {
      cb(error)
    }
  },
  getOrderById: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id
      const orders = await Order.findAll({
        where: { userId: reqUserId, id },
        attributes: ['id', 'sub_total', 'total', 'status', 'comments', 'updated_at', 'created_at'],
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
      })

      if (orders.length === 0) throw new Error('找不到訂單，請在確認一次喔！')
      const data = processOrders(orders)

      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  postOrder: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const products = req.body.product
      const tax = 1.1

      const productQueries = products.map(async product => {
        const item = await Product.findOne({
          where: { id: product.id },
          attributes: ['id', 'name', 'image', 'price'],
        })
        if (!item) {
          throw new Error(`商品ID: ${product.id}， 不存在!`)
        }
        return { item, qty: product.qty }
      })
      const queriedProducts = await Promise.all(productQueries)

      const subTotal = queriedProducts.reduce((total, product) => {
        return total + product.item.price * product.qty
      }, 0)

      const transaction = await db.sequelize.transaction()
      try {
        const order = await Order.create(
          {
            userId: reqUserId,
            shipmentId: req.body.shipment_id,
            sub_total: subTotal,
            total: (subTotal * tax).toFixed(1),
            status: 'pending',
            comments: req.body.comments,
          },
          { transaction }
        )

        const orderItemPromises = products.map(product => {
          return OrderItem.create(
            {
              orderId: order.id,
              productId: product.id,
              qty: product.qty,
            },
            { transaction }
          )
        })
        await Promise.all(orderItemPromises)

        await transaction.commit()
        cb(null, { order, products: queriedProducts })
      } catch (err) {
        await transaction.rollback()
        throw err
      }
    } catch (error) {
      cb(error)
    }
  },
  patchOrderById: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id

      const order = await Order.findOne({ where: { userId: reqUserId, id } })
      if (!order) throw new Error('找不到訂單')

      const updatedOrder = await order.update({ cancel: new Date() })
      cb(null, updatedOrder)
    } catch (error) {
      cb(error)
    }
  },
}

module.exports = userServices
