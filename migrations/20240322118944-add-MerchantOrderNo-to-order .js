'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Orders', 'MerchantOrderNo', {
        type: Sequelize.STRING,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([queryInterface.removeColumn('Orders', 'MerchantOrderNo')])
  },
}
