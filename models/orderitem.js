'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' })
      OrderItem.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'OrderItems',
      underscored: true,
    }
  )
  return OrderItem
}
