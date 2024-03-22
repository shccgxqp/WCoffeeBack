'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Orders', 'payment_status', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Orders', 'payment_type', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Orders', 'payment_bank', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Orders', 'payment_act', {
        type: Sequelize.STRING,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Orders', 'payment_status'),
      queryInterface.removeColumn('Orders', 'payment_type'),
      queryInterface.removeColumn('Orders', 'payment_bank'),
      queryInterface.removeColumn('Orders', 'payment_act'),
    ])
  },
}
