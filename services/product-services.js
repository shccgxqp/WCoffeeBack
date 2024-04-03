const db = require('../models')
const { Product, Category, Origin, Unit } = db
const { processProductsHandler } = require('../helpers/process-helpers')

const productServices = {
  getProducts: async (req, cb) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 8
      const Category_id = parseInt(req.query.categoryId)
      let message = '沒有找到商品'

      const totalCount = await Product.count({
        where: Category_id ? { categoryId: Category_id } : {},
      })

      if (totalCount === 0) cb(null, { message, totalCount, products: [] })
      else {
        const data = await Product.findAll({
          where: Category_id ? { categoryId: Category_id } : {},
          include: [
            { model: Category, attributes: ['name'] },
            { model: Origin, attributes: ['name'] },
            { model: Unit, attributes: ['name'] },
          ],
          limit,
          offset: (page - 1) * limit,
          raw: true,
        })

        message = `搜尋成功，找到${data.length}項商品！`
        const products = processProductsHandler(data)
        cb(null, { message, totalCount, products })
      }
    } catch (err) {
      cb(err, null)
    }
  },
  getProductById: async (req, cb) => {
    try {
      let message = '搜尋失敗！'
      const data = await Product.findByPk(req.params.id, {
        include: [
          { model: Category, attributes: ['name'] },
          { model: Origin, attributes: ['name'] },
          { model: Unit, attributes: ['name'] },
        ],
        raw: true,
      })
      if (!data) cb(null, { message, product: [] })
      else {
        const product = processProductsHandler([data])[0]
        message = '搜尋成功！'
        cb(null, { message, product })
      }
    } catch (err) {
      cb(err, null)
    }
  },
}

module.exports = productServices
