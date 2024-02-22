'use strict'

const origins = [
  '其他',
  '蘇門答臘 印尼',
  '勒塞爾山 印尼',
  '衣索比亞 非洲',
  '肯亞 非洲',
  '瓜地馬拉 拉丁美洲',
  '哥斯大黎加 拉丁美洲',
  '尼加拉瓜 拉丁美洲',
  '哥倫比亞 拉丁美洲',
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Origins', [
      ...origins.map(item => ({
        name: item,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Origins', null, {})
  },
}
