'use strict'

const data = [
  {
    user_id: 1,
    address: '台北市大安區大安路二段2號2樓',
    city: 'Taipei',
    state: 'Home',
    country: 'Taiwan',
    zip_code: 1,
  },
  {
    user_id: 1,
    address: '台北市天龍區非洲路酋長公路2號2樓',
    city: 'Taipei',
    state: 'company',
    country: 'Taiwan',
    zip_code: 2,
  },
  {
    user_id: 2,
    address: '高雄愛笑區笑瞇瞇一樓',
    city: 'Kaohsiung',
    state: 'Home',
    country: 'Taiwan',
    zip_code: 1,
  },
  {
    user_id: 3,
    address: '花蓮國海邊拾荒公寓5樓4號',
    city: 'HuaLien',
    state: 'Home',
    country: 'Taiwan',
    zip_code: 1,
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Shipments', [
      ...data.map(item => ({
        user_id: item.user_id,
        address: item.address,
        city: item.city,
        state: item.state,
        country: item.country,
        zip_code: item.zip_code,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shipments', null, {})
  },
}
