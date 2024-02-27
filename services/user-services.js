const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const { User, Order, OrderItem, Product, Shipment } = db

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
      if (req.body.password !== req.body.passwordCheck) throw new Error('密碼輸入有誤，請確認!')
      const existingUser = await User.findOne({ where: { email: req.body.email } })
      if (existingUser) throw new Error('信箱已被註冊!')

      const hash = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })

      const userData = user.toJSON()
      delete userData.password

      cb(null, { data: { message: '註冊成功!', user: userData } })
    } catch (err) {
      cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } })
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
      if (!shipments || shipments.length === 0) throw new Error('請建立貨運資料!')

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
      if (!shipment) throw new Error('找不到貨運資料!')
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

      if (!address || !city || !country || !state || !zip_code)
        throw new Error('請填寫所有必要的地址資料!')

      const existingShipment = await Shipment.findOne({ where: { userId: reqUserId, state } })
      if (existingShipment) throw new Error('請勿重複建立相同狀態的貨運資料!')

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

      // 使用 await 關鍵字等待訂單查詢完成
      const orders = await Order.findAll({
        where: { userId: reqUserId },
        attributes: ['id', 'sub_total', 'total', 'status', 'comments'],
        include: [
          { model: Shipment, attributes: ['address', 'city', 'state', 'country', 'zip_code'] },
          {
            model: Product,
            as: 'OrderItemsProduct',
            attributes: ['name', 'price', 'weight', 'roast', 'image'],
            through: { attributes: ['qty'] },
          },
        ],
        raw: true,
      })

      // 初始化目標鍵和索引陣列
      const targetKey = 'OrderItemsProduct.OrderItems.orderId'
      const data = []
      const indexMap = new Map()

      // 將訂單資料組織成結構化的物件
      orders.forEach(order => {
        const orderId = order[targetKey]
        const orderData = {
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
        }

        // 如果索引陣列中存在該訂單ID，則將產品信息合併到該訂單中
        if (indexMap.has(orderId)) {
          const index = indexMap.get(orderId)
          data[index].OrderItemsProduct.push(orderData.OrderItemsProduct[0])
        } else {
          // 否則新增一個訂單並添加到索引陣列中
          data.push(orderData)
          indexMap.set(orderId, data.length - 1)
        }
      })

      // 回調函數返回訂單數據
      cb(null, [...data])
    } catch (error) {
      // 捕獲任何錯誤並進行處理，回調函數返回錯誤訊息
      cb(error)
    }
  },
  getOrderById: async (req, cb) => {
    try {
      const reqUserId = req.user.id
      const id = req.params.id
      const orders = await Order.findAll({
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
      })
      if (orders.length === 0) throw new Error('找不到訂單，請在確認一次喔！')

      const data = orders.map(order => ({
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
      }))

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
