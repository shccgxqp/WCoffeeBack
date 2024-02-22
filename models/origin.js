'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Origin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Origin.hasMany(models.Product, { foreignKey: 'originId' });
    }
  }
  Origin.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Origin',
      tableName: 'Origins',
      underscored: true,
    }
  );
  return Origin;
};
