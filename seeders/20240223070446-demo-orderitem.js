'use strict'

const data = [
  {
    order_id: 1,
    product_id: 1,
    qty: 1,
  },
  {
    order_id: 1,
    product_id: 2,
    qty: 1,
  },
  {
    order_id: 2,
    product_id: 3,
    qty: 1,
  },
  {
    order_id: 2,
    product_id: 3,
    qty: 1,
  },
  {
    order_id: 3,
    product_id: 8,
    qty: 2,
  },
  {
    order_id: 3,
    product_id: 7,
    qty: 1,
  },
  {
    order_id: 5,
    product_id: 8,
    qty: 1,
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('OrderItems', [
      ...data.map(item => ({
        ...item,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderItems', null, {})
  },
}
