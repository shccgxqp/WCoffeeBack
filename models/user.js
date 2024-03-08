'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Shipment, { foreignKey: 'userId' })
      User.hasMany(models.Order, { foreignKey: 'userId' })
    }
  }
  User.init(
    {
      last_name: DataTypes.STRING,
      first_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      level: DataTypes.INTEGER,
      birthday: DataTypes.DATE,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      carrier_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
    }
  )
  return User
}
