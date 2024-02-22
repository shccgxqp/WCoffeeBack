'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipment.belongsTo(models.User, { foreignKey: 'userId' });
      Shipment.hasMany(models.Order, { foreignKey: 'shipmentId' });
    }
  }
  Shipment.init(
    {
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      zip_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Shipment',
      tableName: 'Shipments',
      underscored: true,
    }
  );
  return Shipment;
};
