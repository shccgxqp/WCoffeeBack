const { Order, User, Product, Category, Origin, Unit, OrderItem, Shipment } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const db = require('../models')
const { processOrderHandler, processProductsHandler } = require('../helpers/process-helpers')
const { errorHandler } = require('../helpers/error-helpers')
const adminServices = {
  getOrders: async (req, cb) => {
    try {
      const orders = await Order.findAll({
        attributes: ['id', 'sub_total', 'total', 'status', 'comments'],
        include: [
          { model: User, attributes: ['last_name', 'first_name', 'email'] },
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

      const data = processOrderHandler(orders)

      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  getOrderById: async (req, cb) => {
    try {
      const id = req.params.id
      const orders = await Order.findAll({
        where: { id },
        attributes: ['id', 'sub_total', 'total', 'status', 'comments'],
        include: [
          { model: User, attributes: ['last_name', 'first_name', 'email'] },
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

      if (orders.length === 0) throw errorHandler(`查無此訂單編號 ${id}`, 401)
      const data = processOrderHandler(orders)

      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  patchOrderById: async (req, cb) => {
    try {
      const { status, comments, shipment_id, products, user_id } = req.body
      const transaction = await db.sequelize.transaction()
      try {
        const order = await Order.findByPk(req.params.id, { transaction })
        if (!order) throw errorHandler(`訂單編號: ${req.params.id} 不存在！`, 401)
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

        await OrderItem.destroy({ where: { orderId: req.params.id }, transaction })
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

        const data = await Order.update(
          {
            user_id: user_id,
            shipment_id: shipment_id,
            sub_total: subTotal,
            total: (subTotal * 1.1).toFixed(1),
            comments: comments,
            status: status,
            payment_status: req.body.payment_status || '未付款',
          },
          { where: { id: req.params.id } },
          { transaction }
        )
        await transaction.commit()
        cb(null, { message: '更新成功！' })
      } catch (error) {
        await transaction.rollback()
        throw errorHandler('更新失敗', 401)
      }
    } catch (error) {
      cb(error)
    }
  },
  deleteOrderById: async (req, cb) => {
    try {
      const id = req.params.id
      const transaction = await db.sequelize.transaction()
      const orderToDelete = await Order.findByPk(id, { transaction })

      if (orderToDelete) {
        await OrderItem.destroy({ where: { orderId: id }, transaction })
        await Order.destroy({ where: { id }, transaction })
        await transaction.commit()
        cb(null, `已刪除訂單編號: ${id}`)
      } else {
        throw errorHandler(`訂單編號: ${id} 查詢失敗。`, 1)
      }
    } catch (error) {
      cb(error)
    }
  },
  createProducts: async (req, cb) => {
    try {
      const category = await Category.findAll({ attributes: ['id', 'name'] })
      const origin = await Origin.findAll({ attributes: ['id', 'name'] })
      const unit = await Unit.findAll({ attributes: ['id', 'name'] })
      cb(null, { category, origin, unit })
    } catch (error) {
      cb(error)
    }
  },
  getProducts: async (req, cb) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit)
        ? Math.min(Math.max(parseInt(req.query.limit), 8), 24)
        : 8
      const Category_id = parseInt(req.query.categoryId) || 3
      const data = await Product.findAll({
        where: { Category_id },
        include: [
          { model: Category, attributes: ['name'] },
          { model: Origin, attributes: ['name'] },
          { model: Unit, attributes: ['name'] },
        ],
        offset: (page - 1) * limit,
        raw: true,
      })
      if (data.length === 0) throw errorHandler('沒有找到商品', 401)

      const products = processProductsHandler(data)

      cb(null, products)
    } catch (error) {
      cb(error)
    }
  },
  getProductById: async (req, cb) => {
    try {
      const data = await Product.findByPk(req.params.id, {
        include: [
          { model: Category, attributes: ['name'] },
          { model: Origin, attributes: ['name'] },
          { model: Unit, attributes: ['name'] },
        ],
        raw: true,
      })

      const product = processProductsHandler([data])

      cb(null, product)
    } catch (error) {
      cb(error)
    }
  },
  postProduct: async (req, cb) => {
    try {
      const { name, price, weight, roast, description, category_id, origin_id, unit_id } = req.body
      if (!name || !price || !weight || !description || !category_id || !origin_id || !unit_id)
        throw errorHandler('欄位不得為空', 401)
      const { file } = req
      const filePath = await localFileHandler(file)
      const data = await Product.create({
        name,
        price,
        weight,
        roast: roast || null,
        image: filePath || null,
        description,
        categoryId: category_id,
        originId: origin_id,
        unitId: unit_id,
      })
      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  patchProductById: async (req, cb) => {
    try {
      const { name, price, weight, roast, description, category_id, origin_id, unit_id } = req.body
      const { file } = req
      const filePath = await localFileHandler(file)
      const data = await Product.update(
        {
          name,
          price,
          weight,
          roast: roast || null,
          image: filePath || null,
          description,
          categoryId: category_id,
          originId: origin_id,
          unitId: unit_id,
        },
        { where: { id: req.params.id } }
      )
      if (data[0] === 1) cb(null, '修改成功')
      else throw errorHandler('修改失敗', 401)
    } catch (error) {
      cb(error)
    }
  },
  deleteProductById: async (req, cb) => {
    try {
      const data = await Product.destroy({ where: { id: req.params.id } })
      if (data === 1) cb(null, '刪除成功')
      else throw errorHandler('刪除失敗', 401)
    } catch (error) {
      cb(error)
    }
  },
  getUsers: async (req, cb) => {
    try {
      let data = await User.findAll({
        attributes: ['id', 'last_name', 'first_name', 'email', 'isAdmin', 'phone', 'birthday'],
      })
      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  getUserById: async (req, cb) => {
    try {
      const data = await User.findOne({ where: { id: req.params.id } })
      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  patchUser: async (req, cb) => {
    try {
      await User.update(req.body, { where: { id: req.params.id } })
      cb(null, { message: '修改成功' })
    } catch (error) {
      cb(error)
    }
  },
}
module.exports = adminServices
