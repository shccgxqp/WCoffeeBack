const db = require('../models')
const { Product, Category, Origin, Unit } = db

const productServices = {
  getProducts: async (req, cb) => {
    try {
      const data = await Product.findAll({
        include: [
          { model: Category, attributes: ['name'] },
          { model: Origin, attributes: ['name'] },
          { model: Unit, attributes: ['name'] },
        ],
        raw: true,
      })

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
    } catch (err) {
      cb(err, null)
    }
  },
}

module.exports = productServices
