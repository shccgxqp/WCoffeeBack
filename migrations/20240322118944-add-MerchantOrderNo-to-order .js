'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Orders', 'merchant_order_no', {
        type: Sequelize.STRING,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([queryInterface.removeColumn('Orders', 'merchant_order_no')])
  },
}
