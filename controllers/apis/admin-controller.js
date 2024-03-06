const adminServices = require('../../services/admin-services')

const adminController = {
  getOrders: (req, res, next) => {
    adminServices.getOrders(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getOrderById: (req, res, next) => {
    adminServices.getOrderById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  patchOrderById: (req, res, next) => {
    adminServices.patchOrderById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  deleteOrderById: (req, res, next) => {
    adminServices.deleteOrderById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  createProducts: (req, res, next) => {
    adminServices.createProducts(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getProducts: (req, res, next) => {
    adminServices.getProducts(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getProductById: (req, res, next) => {
    adminServices.getProductById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  postProduct: (req, res, next) => {
    adminServices.postProduct(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  patchProductById: (req, res, next) => {
    adminServices.patchProductById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  deleteProductById: (req, res, next) => {
    adminServices.deleteProductById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getUsers: (req, res, next) => {
    adminServices.getUser(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getUserById: (req, res, next) => {
    adminServices.getUserById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  patchUsers: (req, res, next) => {
    adminServices.patchUser(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
}

module.exports = adminController
