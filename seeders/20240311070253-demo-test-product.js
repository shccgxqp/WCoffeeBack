'use strict'

const items = [
  {
    name: '衣索比亞｜日曬｜淺烘焙 Light Roast',
    price: 300,
    weight: 80,
    roast: 2,
    image: '11',
    Category_id: 2,
    Origin_id: 4,
    unit_id: 7,
    description: '衣索比亞 日曬10入/盒風味：莓果、紅糖、伯爵紅茶',
  },
  {
    name: '耶加雪啡｜水洗｜淺烘焙 Light Roast',
    price: 400,
    weight: 80,
    roast: 2,
    image: '11',
    Category_id: 2,
    Origin_id: 6,
    unit_id: 7,
    description: '耶加雪啡 水洗10入/盒 風味：白色花香調、豐富多汁、口感豐富、餘韻綿密',
  },
  {
    name: '薇薇特南果｜水洗｜淺烘焙 Light Roast',
    price: 1200,
    weight: 80,
    roast: 2,
    image: '11',
    Category_id: 2,
    Origin_id: 3,
    unit_id: 7,
    description: '薇薇特南果 水洗10入/盒 風味：堅果、莓果、巧克力',
  },
  {
    name: '哥倫比亞｜水洗｜中深烘焙 Dark Medium Roast',
    price: 400,
    weight: 80,
    roast: 2,
    image: '11',
    Category_id: 2,
    Origin_id: 9,
    unit_id: 7,
    description: '哥倫比亞10入/袋風味：黑巧克力、厚實圓潤、細緻酸質',
  },
  {
    name: 'V60老岩泥02濾杯 1次燒火山黑',
    price: 2017,
    weight: 500,
    roast: null,
    image: '15',
    Category_id: 4,
    Origin_id: 1,
    unit_id: 6,
    description: '台灣在地老岩泥，炎焱燒手法保留咖啡甘醇風味',
  },
  {
    name: 'V60老岩泥01濾杯 5次燒',
    price: 2153,
    weight: 500,
    roast: null,
    image: '16',
    Category_id: 4,
    Origin_id: 1,
    unit_id: 6,
    description: '台灣在地老岩泥，炎焱五次燒手法保留咖啡甘醇風味',
  },
  {
    name: 'V60白色01樹脂濾杯',
    price: 171,
    weight: 300,
    roast: null,
    image: '17',
    Category_id: 4,
    Origin_id: 1,
    unit_id: 6,
    description: '螺旋型肋拱設計 更易萃取咖啡的美味',
  },
  {
    name: 'V60灰白手沖咖啡壺組1-4杯份',
    price: 585,
    weight: 300,
    roast: null,
    image: '18',
    Category_id: 4,
    Origin_id: 1,
    unit_id: 6,
    description: '咖啡壺套裝商品',
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      ...items.map(item => ({
        name: item.name,
        price: item.price,
        weight: item.weight,
        roast: item.roast,
        image: item.image,
        Category_id: item.Category_id,
        Origin_id: item.Origin_id,
        description: item.description,
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
