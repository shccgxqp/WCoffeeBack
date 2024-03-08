'use strict'
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          // 一次新增三筆資料
          email: 'wangcoffee@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: true,
          last_name: 'Wang',
          first_name: 'Coffee',
          phone: '',
          level: 0,
          birthday: new Date('1990-01-21'),
          country: 'TW',
          city: '台北市',
          carrier_code: '/eq865+d',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          last_name: 'test',
          first_name: '01',
          phone: '',
          level: 1,
          birthday: new Date('1995-04-20'),
          country: 'TW',
          city: '台南市',
          carrier_code: '/eq870+d',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          last_name: 'test',
          first_name: '02',
          phone: '',
          level: 2,
          birthday: new Date('1997-5-04'),
          country: 'TW',
          city: '高雄市',
          carrier_code: '/eq405+d',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  },
}
