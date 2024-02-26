const userServices = require('../../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getShipment: (req, res, next) => {
    userServices.getShipment(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getShipmentById: (req, res, next) => {
    userServices.getShipmentById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  postShipment: (req, res, next) => {
    userServices.postShipment(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  patchShipmentById: (req, res, next) => {
    userServices.patchShipment(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  deleteShipmentById: (req, res, next) => {
    userServices.deleteShipment(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getOrder: (req, res, next) => {
    userServices.getOrder(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getOrderById: (req, res, next) => {
    userServices.getOrderById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  postOrder(req, res, next) {
    userServices.postOrder(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  patchOrderById(req, res, next) {
    userServices.patchOrderById(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
}

module.exports = userController
