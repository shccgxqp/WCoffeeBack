'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Origin, { foreignKey: 'originId' })
      Product.belongsTo(models.Unit, { foreignKey: 'unitId' })
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Product.belongsToMany(models.Order, {
        through: 'OrderItems',
        foreignKey: 'productId',
        as: 'OrderItemsOrder',
      })
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      weight: DataTypes.DECIMAL,
      roast: DataTypes.INTEGER,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      underscored: true,
    }
  )
  return Product
}
