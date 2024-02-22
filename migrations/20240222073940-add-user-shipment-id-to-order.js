'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Orders', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      }),
      queryInterface.addColumn('Orders', 'shipment_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Shipments',
          key: 'id',
        },
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'user_id');
  },
};
