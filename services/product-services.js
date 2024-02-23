const db = require('../models')
const { Product, Category, Origin, Unit } = db

const productServices = {
  getProducts: (req, cb) => {
    Product.findAll({
      include: [
        { model: Category, attributes: ['name'] },
        { model: Origin, attributes: ['name'] },
        { model: Unit, attributes: ['name'] },
      ],
      raw: true,
    })
      .then(data => {
        const products = data.map(product => {
          const { id, name, price, weight, roast, description, image, ...productData } = {
            ...product,
          }
          const Category = productData['Category.name']
          const Origin = productData['Origin.name']
          const Unit = productData['Unit.name']

          return {
            id,
            name,
            Category,
            Origin,
            Unit,
            price,
            weight,
            roast,
            image,
            description,
          }
        })
        cb(null, products)
      })
      .catch(err => {
        cb(err, null)
      })
  },
  getProductById: (req, cb) => {
    Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['name'] },
        { model: Origin, attributes: ['name'] },
        { model: Unit, attributes: ['name'] },
      ],
      raw: true,
    })
      .then(data => {
        const { id, name, price, weight, roast, description, image, ...productData } = {
          ...data,
        }
        const Category = productData['Category.name']
        const Origin = productData['Origin.name']
        const Unit = productData['Unit.name']
        const product = {
          id,
          name,
          Category,
          Origin,
          Unit,
          price,
          weight,
          roast,
          image,
          description,
        }
        cb(null, product)
      })
      .catch(err => {
        cb(err, null)
      })
  },
}

module.exports = productServices
