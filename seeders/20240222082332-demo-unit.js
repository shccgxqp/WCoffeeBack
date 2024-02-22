'use strict'

const units = ['其他', '包', '磅', '半磅', '台', '個', '盒']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Units', [
      ...units.map(item => ({
        name: item,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Units', null, {})
  },
}
