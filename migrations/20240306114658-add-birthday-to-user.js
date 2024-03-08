'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Users', 'birthday', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('Users', 'carrier_code', {
        type: Sequelize.STRING,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Users', 'birthday'),
      queryInterface.removeColumn('Users', 'carrier_code'),
    ])
  },
}
