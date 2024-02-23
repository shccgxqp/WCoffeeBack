const productServices = require('../../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getProductById: (req, res, next) => {
    productServices.getProductById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
}

module.exports = productController
