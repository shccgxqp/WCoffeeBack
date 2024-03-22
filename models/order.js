'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.belongsTo(models.Shipment, { foreignKey: 'shipmentId' })
      Order.belongsToMany(models.Product, {
        through: 'OrderItems',
        foreignKey: 'orderId',
        as: 'OrderItemsProduct',
      })
    }
  }
  Order.init(
    {
      sub_total: DataTypes.DECIMAL,
      total: DataTypes.DECIMAL,
      status: DataTypes.STRING,
      comments: DataTypes.STRING,
      cancel: DataTypes.DATE,
      payment_status: DataTypes.STRING,
      payment_type: DataTypes.STRING,
      payment_bank: DataTypes.STRING,
      payment_act: DataTypes.STRING,
      merchant_order_no: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      underscored: true,
    }
  )
  return Order
}
