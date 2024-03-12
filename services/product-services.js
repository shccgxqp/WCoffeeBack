const db = require('../models')
const { Product, Category, Origin, Unit } = db
const { processOrders, processProducts } = require('../helpers/process-helpers')

const productServices = {
  getProducts: async (req, cb) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 8
      const Category_id = parseInt(req.query.categoryId) || 3

      const totalCount = await Product.count({ where: { Category_id } })
      const data = await Product.findAll({
        where: { Category_id },
        include: [
          { model: Category, attributes: ['name'] },
          { model: Origin, attributes: ['name'] },
          { model: Unit, attributes: ['name'] },
        ],
        limit,
        offset: (page - 1) * limit,
        raw: true,
      })
      if (data.length === 0) {
        const error = new Error('沒有找到商品')
        error.status = 401
        throw error
      }
      const products = processProducts(data)
      cb(null, { totalCount, products })
    } catch (err) {
      cb(err, null)
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
    } catch (err) {
      cb(err, null)
    }
  },
}

module.exports = productServices
