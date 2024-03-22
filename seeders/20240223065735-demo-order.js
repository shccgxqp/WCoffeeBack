'use strict'

const data = [
  {
    user_id: 1,
    shipment_id: 1,
    sub_total: 800,
    total: 880,
    status: 'complete',
    comments: 'test',
    payment_status: '付款完成',
    payment_type: 'WEBATM',
    payment_bank: '809',
    payment_act: '12345',
  },
  {
    user_id: 1,
    shipment_id: 2,
    sub_total: 900,
    total: 990,
    status: 'pending',
    comments: 'test',
    payment_status: '付款完成',
    payment_type: 'CREDIT',
    payment_bank: 'Taishin',
    payment_act: '4000111111',
  },
  {
    user_id: 2,
    shipment_id: 3,
    sub_total: 2000,
    total: 2200,
    status: 'pending',
    comments: 'test',
    payment_status: '付款完成',
    payment_type: 'WEBATM',
    payment_bank: '809',
    payment_act: '12345',
  },
  {
    user_id: 3,
    shipment_id: 4,
    sub_total: 400,
    total: 440,
    status: 'pending',
    comments: 'test',
    payment_status: '付款完成',
    payment_type: 'WEBATM',
    payment_bank: '809',
    payment_act: '12345',
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
