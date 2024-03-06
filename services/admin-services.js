const { Order, User, Product, Category, Origin, Unit, OrderItem, Shipment } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const db = require('../models')
const { processOrders, processProducts } = require('../helpers/process-helpers')
const adminServices = {
  getOrders: async (req, cb) => {
    try {
      const orders = await Order.findAll({
        attributes: ['id', 'sub_total', 'total', 'status', 'comments'],
        include: [
          { model: User, attributes: ['name', 'email'] },
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

      const data = processOrders(orders)

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
          { model: User, attributes: ['name', 'email'] },
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
  patchOrderById: async (req, cb) => {
    try {
      const data = await Order.update(req.body, { where: { id: req.params.id } })
      cb(null, data)
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
        throw new Error(`訂單編號: ${id} 查詢失敗。`)
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
      const data = await Product.findAll({
        include: [
          { model: Category, attributes: ['name'] },
          { model: Origin, attributes: ['name'] },
          { model: Unit, attributes: ['name'] },
        ],
        offset: (page - 1) * limit,
        raw: true,
      })
      if (data.length === 0) throw new Error('沒有找到商品')

      const products = processProducts(data)

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

      const product = processProducts([data])

      cb(null, product)
    } catch (error) {
      cb(error)
    }
  },
  postProduct: async (req, cb) => {
    try {
      const { name, price, weight, roast, description, category_id, origin_id, unit_id } = req.body
      if (!name || !price || !weight || !description || !category_id || !origin_id || !unit_id)
        throw new Error('欄位不得為空')
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
      else cb(new Error('修改失敗'))
    } catch (error) {
      cb(error)
    }
  },
  deleteProductById: async (req, cb) => {
    try {
      const data = await Product.destroy({ where: { id: req.params.id } })
      if (data === 1) cb(null, '刪除成功')
      else cb(new Error('刪除失敗'))
    } catch (error) {
      cb(error)
    }
  },
  getUsers: async (req, cb) => {
    try {
      const data = await User.findOne({ where: { id: req.user.id } })
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
      const data = await User.update(req.body, { where: { id: req.user.id } })
      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
}
module.exports = adminServices
