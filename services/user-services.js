const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const { User, Order, OrderItem, Product, Shipment } = db
const { processOrderHandler } = require('../helpers/process-helpers')
const { errorHandler } = require('../helpers/error-helpers')

const userServices = {
  signIn: async (req, cb) => {
    try {
      // console.log(req.user)
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
      // throw error

      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        throw errorHandler('1|請輸入正確的信箱格式!', 401)
      if (password_check.length < 6) throw errorHandler('2|密碼長度不足6位，請確認!', 401)
      if (password !== password_check) throw errorHandler('2|密碼與確認密碼不符，請確認!', 401)
      if (last_name === '') throw errorHandler('3|姓氏輸入有誤，請確認!', 401)
      if (first_name === '') throw errorHandler('4|名字輸入有誤，請確認!', 401)
      if (!/^[0-9]+$/.test(phone) || phone.length !== 10)
        throw errorHandler('5|手機號碼輸入有誤，請確認!', 401)
      if (country === '') throw errorHandler('6|國家輸入有誤，請確認!', 401)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(birthday) ||
        birthday >= new Date().toISOString().split('T')[0]
      )
        throw errorHandler('7|生日輸入有誤，請確認!', 401)

      const existingUser = await User.findOne({ where: { email: req.body.email } })
      if (existingUser) throw errorHandler('信箱已被註冊!', 401)

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

      cb(null, { message: '註冊成功!', user: data })
    } catch (err) {
      cb(err)
    }
  },
  checkLogin: async (req, cb) => {
    try {
      if (!req.user) {
        cb(null, { isLogin: false, isAdmin: false })
      } else {
        const user = await User.findOne({ where: { id: req.user.id } })
        delete user.password
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: '30d',
        })
        cb(null, { isLogin: true, isAdmin: user.isAdmin, token })
      }
    } catch (err) {
      cb(err)
    }
  },
  checkLoginFbGl: async (req, cb) => {
    try {
      if (req.user) {
        const user = await User.findOne({ where: { id: req.user.id } })
        delete user.password
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: '30d',
        })
        cb(null, { token })
      }
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
      if (!user) throw errorHandler('沒有找到使用者', 401)
      const userData = user.toJSON()
      delete userData.password
      cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  getUserEdit: async (req, cb) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: [
          'id',
          'last_name',
          'first_name',
          'phone',
          'birthday',
          'country',
          'city',
          'carrier_code',
        ],
      })
      const userData = user.toJSON()
      cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  putUserEdit: async (req, cb) => {
    try {
      const { last_name, first_name, phone, birthday, country, city, carrier_code } = req.body

      if (last_name === '') throw errorHandler('姓氏輸入有誤，請確認!', 401)
      if (first_name === '') throw errorHandler('名字輸入有誤，請確認!', 401)
      if (!/^[0-9]+$/.test(phone) || phone.length !== 10)
        throw errorHandler('手機號碼輸入有誤，請確認!', 401)
      if (country === '') throw errorHandler('國家輸入有誤，請確認!', 401)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(birthday) ||
        birthday >= new Date().toISOString().split('T')[0]
      )
        throw errorHandler('生日輸入有誤，請確認!', 401)

      const user = await User.findOne({ where: { id: req.user.id } })
      if (!user) throw errorHandler('沒有找到使用者', 401)

      user.last_name = last_name
      user.first_name = first_name
      user.phone = phone
      user.birthday = birthday
      user.country = country
      user.city = city
      user.carrier_code = carrier_code
      await user.save()

      const userData = user.toJSON()
      cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  getShipment: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const shipments = await Shipment.findAll({ where: { userId: reqUserId } })
      if (!shipments || shipments.length === 0) throw errorHandler('請建立配送資料!', 401)
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
      if (!shipment) throw errorHandler(`id = ${req.user.id} 找不到貨運資料!`, 401)
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
      if (!address || !city || !country || !state || !zip_code)
        throw errorHandler('請填寫所有必要的地址資料!', 401)

      const existingShipment = await Shipment.findOne({ where: { userId: reqUserId, state } })
      if (existingShipment) throw errorHandler('配送名稱已存在，請確認!', 401)

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
      const { address, city, country, state, zip_code } = req.body

      const shipment = await Shipment.findOne({ where: { userId: reqUserId, id } })

      if (!shipment) throw errorHandler('找不到貨運資料!', 401)
      if (state && state !== shipment.state) {
        const existingShipment = await Shipment.findOne({ where: { userId: reqUserId, state } })
        if (existingShipment) throw errorHandler('貨運名稱已存在，請確認!', 401)
      }
      shipment.address = address
      shipment.city = city
      shipment.country = country
      shipment.state = state
      shipment.zip_code = zip_code
      shipment.save()

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
      if (orders.length > 0) throw errorHandler('已有訂單，無法刪除!', 401)

      const shipment = await Shipment.findOne({ where: { userId: reqUserId, id } })
      if (!shipment) throw errorHandler('找不到貨運資料!', 401)
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
      const limit = parseInt(req.query.limit) || 8

      let message = '沒有查詢到訂單'

      const totalCount = await Order.count({ where: { userId: reqUserId } })

      if (totalCount === 0) cb(null, { message, totalCount, orders: data })
      else {
        message = '查詢成功！'
        const orders = await Order.findAll({
          where: { userId: reqUserId },
          attributes: [
            'id',
            'sub_total',
            'total',
            'status',
            'comments',
            'payment_status',
            'payment_type',
            'payment_bank',
            'payment_act',
            'updated_at',
            'created_at',
          ],
          include: [
            { model: Shipment, attributes: ['address', 'city', 'state', 'country', 'zip_code'] },
            {
              model: Product,
              as: 'OrderItemsProduct',
              attributes: ['name', 'price', 'weight', 'roast', 'image'],
              through: { attributes: ['qty'] },
            },
          ],
          order: [['created_at', 'DESC']],
          limit,
          offset: (page - 1) * limit,
          raw: true,
        })
        const data = processOrderHandler(orders)
        cb(null, { message, totalCount, orders: data })
      }
    } catch (error) {
      cb(error)
    }
  },
  getOrderById: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id
      let message = '沒有查詢到訂單'
      const orders = await Order.findAll({
        where: { userId: reqUserId, id },
        attributes: [
          'id',
          'sub_total',
          'total',
          'status',
          'comments',
          'payment_status',
          'payment_type',
          'payment_bank',
          'payment_act',
          'updated_at',
          'created_at',
        ],
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
      if (orders.length === 0) cb(null, { message, orders: {} })
      else {
        message = '查詢成功！'
        const data = processOrderHandler(orders)[0]
        cb(null, { message, order: data })
      }
    } catch (error) {
      cb(error)
    }
  },
  postOrder: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const products = req.body.products
      const tax = 1.1

      const productQueries = products.map(async product => {
        const item = await Product.findOne({
          where: { id: product.id },
          attributes: ['id', 'name', 'image', 'price'],
        })
        if (!item) throw errorHandler(`商品ID: ${product.id}， 不存在!`, 401)
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
            payment_status: '未付款',
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
      if (!order) throw errorHandler('找不到訂單', 401)
      const updatedOrder = await order.update({ cancel: new Date() })
      cb(null, updatedOrder)
    } catch (error) {
      cb(error)
    }
  },
}

module.exports = userServices
