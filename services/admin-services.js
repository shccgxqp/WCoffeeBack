const { User, Product, Category, Origin, Unit } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getOrders: async (req, cb) => {
    try {
      const data = await Order.findAll({
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
      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  getOrderById: async (req, cb) => {
    try {
      const data = await Order.findOne({ where: { id: req.params.id } })
      cb(null, data)
    } catch (error) {
      cb(error)
    }
  },
  postOrder: async (req, cb) => {
    try {
      const data = await Order.create(req.body)
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
      const data = await Order.destroy({ where: { id: req.params.id } })
      cb(null, data)
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
      const page = req.query.page || 1
      const limit = req.query.limit ? Math.min(Math.max(parseInt(req.query.limit), 8), 24) : 8
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

      const products = data.map(product => ({
        id: product.id,
        name: product.name,
        Category: product['Category.name'],
        Origin: product['Origin.name'],
        Unit: product['Unit.name'],
        price: product.price,
        weight: product.weight,
        roast: product.roast,
        image: product.image,
        description: product.description,
      }))

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

      const product = {
        id: data.id,
        name: data.name,
        Category: data['Category.name'],
        Origin: data['Origin.name'],
        Unit: data['Unit.name'],
        price: data.price,
        weight: data.weight,
        roast: data.roast,
        image: data.image,
        description: data.description,
      }

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
