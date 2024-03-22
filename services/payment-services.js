const db = require('../models')
const { Order, User } = db
const {
  createSesEncrypt,
  createShaEncrypt,
  createSesDecrypt,
} = require('../helpers/encrypt-helpers')
const { MERCHANTID, VERSION, NOTIFYURL, RETURNURL, CORS_ORIGIN, PAYGATEWAY } = process.env

const paymentServices = {
  newebpay_payment: async (req, cb) => {
    try {
      const orderId = req.params.orderId
      const order = await Order.findOne({ where: { id: parseInt(orderId) } })
      if (order.userId != req.user.id) throw new Error('此訂單不屬於您')

      const user = await User.findOne({ where: { id: order.userId } })
      const data = {
        MerchantID: MERCHANTID, // 商店代號
        RespondType: 'JSON', // 回傳格式
        TimeStamp: Date.now(), // 時間戳記
        Version: VERSION, // 串接程式版本
        MerchantOrderNo: Date.now(), // 訂單號碼
        Amt: parseInt(order.total), // 訂單金額
        ItemDesc: 'ItemDesc 測試', // 訂單描述
        Email: user.email, // 付款人電子信箱
        ReturnURL: NOTIFYURL, // 支付完成返回商店網址
        NotifyURL: NOTIFYURL, // 支付通知網址/每期授權結果通知
        ClientBackURL: `${CORS_ORIGIN}/store`, // 付款完成返回商店網址
        LoginType: 0, // 0=不須藍新會員登入
        OrderComment: 'OrderComment 測試測試', // 商店備註
      }
      console.log(data)
      const TradeInfo = createSesEncrypt(data)
      const TradeSha = createShaEncrypt(TradeInfo)

      cb(null, {
        ...data,
        TradeInfo,
        TradeSha,
      })
    } catch (err) {
      cb(err)
    }
  },
  newebpay_notify: async (req, cb) => {
    try {
      console.log('藍新回傳資料 :', req.body)
      console.log('藍新回傳資料info :', req.body.TradeInfo)
      const response = req.body
      const data = createSesDecrypt(response.TradeInfo)
      console.log('藍新回傳資料 :', data)
      const shaEncrypt = createShaEncrypt(response.TradeInfo)
      console.log('藍新SHA檢查碼 :', shaEncrypt)

      cb(null, data)
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = paymentServices
