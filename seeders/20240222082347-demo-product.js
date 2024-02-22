'use strict'

const coffeeBag = [
  {
    name: '瓜地馬拉安提瓜咖啡豆',
    price: 250,
    weight: 300,
    roast: 2,
    image: '01',
    Category_id: 3,
    origin_id: 6,
    unit_id: 2,
  },
  {
    name: '肯亞AA',
    price: 550,
    weight: 250,
    roast: 1,
    image: '02',
    Category_id: 3,
    origin_id: 5,
    unit_id: 2,
  },
  {
    name: '巴西聖托斯',
    price: 350,
    weight: 250,
    roast: 2,
    image: '03',
    Category_id: 3,
    origin_id: 7,
    unit_id: 2,
  },
  {
    name: '蘇門答臘曼特寧',
    price: 400,
    weight: 250,
    roast: 3,
    image: '04',
    Category_id: 3,
    origin_id: 2,
    unit_id: 2,
  },
  {
    name: '印度曼特寧',
    price: 250,
    weight: 250,
    roast: 4,
    image: '05',
    Category_id: 3,
    origin_id: 1,
    unit_id: 2,
  },
  {
    name: '牙買加藍山',
    price: 350,
    weight: 250,
    roast: 3,
    image: '06',
    Category_id: 3,
    origin_id: 4,
    unit_id: 2,
  },
  {
    name: '哥倫比亞Supremo',
    price: 400,
    weight: 250,
    roast: 4,
    image: '07',
    Category_id: 3,
    origin_id: 9,
    unit_id: 2,
  },
  {
    name: '埃塞俄比亞耶加雪菲',
    price: 800,
    weight: 250,
    roast: 2,
    image: '08',
    Category_id: 3,
    origin_id: 4,
    unit_id: 2,
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      ...coffeeBag.map(item => ({
        name: item.name,
        price: item.price,
        weight: item.weight,
        roast: item.roast,
        image: item.image,
        Category_id: item.Category_id,
        origin_id: item.origin_id,
        unit_id: item.unit_id,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
  },
}
