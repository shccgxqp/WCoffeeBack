'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'Unit_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Units',
        key: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'Unit_id');
  },
};
