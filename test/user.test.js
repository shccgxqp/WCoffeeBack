const expect = require('chai').expect
const supertest = require('supertest')
const app = require('../app')
const db = require('../models')
// const bcrypt = require('bcryptjs')
const api = supertest('http://localhost:3060/api')
let APItoken

describe('# 註冊 - POST /api/signup', () => {
  const user = {
    last_name: 'test',
    first_name: '001',
    email: 'test001@example.com',
    password: '12345678',
    password_check: '12345678',
    phone: '0912345678',
    birthday: '1990-01-21',
    country: 'TW',
    carrier_code: '/eq235+a',
  }
  const userError = [
    {
      email: 'asd@asd.qwert',
      title: '# 註冊失敗 信箱格式錯誤',
      message: '1|請輸入正確的信箱格式!',
      code: 500,
    },
    {
      password_check: '112315616',
      title: '# 註冊失敗 密碼與確認密碼不符',
      message: '2|密碼與確認密碼不符，請確認!',
      code: 500,
    },
    {
      last_name: '',
      title: '# 註冊失敗 姓氏輸入有誤',
      message: '3|姓氏輸入有誤，請確認!',
      code: 500,
    },
    {
      first_name: '',
      title: '# 註冊失敗 名子輸入有誤',
      message: '4|名字輸入有誤，請確認!',
      code: 500,
    },
    {
      phone: '0123456',
      title: '# 註冊失敗 電話未滿10碼',
      message: '5|手機號碼輸入有誤，請確認!',
      code: 500,
    },
    {
      phone: 'asd1611616',
      title: '# 註冊失敗 電話出現數字以外的字元',
      message: '5|手機號碼輸入有誤，請確認!',
      code: 500,
    },
    {
      country: '',
      title: '# 註冊失敗 國家未輸入',
      message: '6|國家輸入有誤，請確認!',
      code: 500,
    },
    {
      birthday: '1999-11-121',
      title: '# 註冊失敗 生日輸入不正確',
      message: '7|生日輸入有誤，請確認!',
      code: 500,
    },
    {
      birthday: new Date().toISOString().split('T')[0],
      title: '# 註冊失敗 生日超過目前日期',
      message: '7|生日輸入有誤，請確認!',
      code: 500,
    },
    {
      email: 'test001@example.com',
      title: '# 註冊失敗 信箱重複申請',
      message: '信箱已被註冊!',
      code: 500,
    },
  ]

  before(async () => {
    await db.User.destroy({ where: {} })
  })

  it('# 註冊成功', async () => {
    const res = await api.post('/signUp').send({ ...user })
    expect(res.statusCode).to.equal(200)
    expect(res.body.data.message).to.equal('註冊成功!')
  })

  it('# 註冊失敗 密碼長度不足6位', async () => {
    const res = await api
      .post('/signUp')
      .send({ ...user, password: '12345', password_check: '12345', email: 'test999@example.com' })
    expect(res.statusCode).to.equal(500)
    expect(res.body.data.message).to.equal('2|密碼長度不足6位，請確認!')
  })

  userError.forEach(data => {
    it(data.title, async () => {
      const firstKey = Object.keys(data)[0]
      const firstValue = data[firstKey]
      const newUser = { ...user, [firstKey]: firstValue }
      const res = await api.post('/signUp').send(newUser)

      expect(res.statusCode).to.equal(data.code)
      expect(res.body.data.message).to.equal(data.message)
    })
  })
})

describe('# 登入 - POST /api/signIn', () => {
  it('# 登入成功', async () => {
    const res = await api
      .post('/signIn')
      .send({ email: 'test001@example.com', password: '12345678' })
    expect(res.statusCode).to.equal(200)
    expect(res.body.message).to.equal('登入成功!')
    APItoken = res.body.data.token
  })
})

describe('# 取得使用者資訊 - GET /api/user', () => {
  it('# 取得使用者資訊', async () => {
    const res = await api.get('/user').set('Authorization', `Bearer ${APItoken}`)
    expect(res.statusCode).to.equal(200)
    expect(res.body.data.email).to.equal('test001@example.com')
    expect(res.body.data.first_name).to.equal('001')
    expect(res.body.data.last_name).to.equal('test')
    expect(res.body.data.phone).to.equal('0912345678')
    expect(res.body.data.birthday).to.equal('1990-01-21T00:00:00.000Z')
    expect(res.body.data.country).to.equal('TW')
    expect(res.body.data.carrier_code).to.equal('/eq235+a')
  })
})
