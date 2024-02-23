'use strict'

const data = [
  {
    user_id: 1,
    shipment_id: 1,
    sub_total: 800,
    total: 880,
    status: 'complete',
    comments: 'test',
  },
  {
    user_id: 1,
    shipment_id: 2,
    sub_total: 900,
    total: 990,
    status: 'pending',
    comments: 'test',
  },
  {
    user_id: 2,
    shipment_id: 3,
    sub_total: 2000,
    total: 2200,
    status: 'pending',
    comments: 'test',
  },
  {
    user_id: 3,
    shipment_id: 4,
    sub_total: 400,
    total: 440,
    status: 'pending',
    comments: 'test',
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', [
      ...data.map(item => ({
        ...item,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {})
  },
}
