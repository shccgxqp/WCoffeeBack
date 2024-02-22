'use strict'

const items = ['其他', '濾掛咖啡', '咖啡豆', '工具', '衣服', '咖啡機', '磨豆機']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      ...items.map(item => ({
        name: item,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  },
}
