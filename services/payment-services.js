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
      console.log('訂單編號 :', orderId)
      const timeStamp = Math.round(new Date().getTime() / 1000)

      const order = await Order.findOne({ where: { id: parseInt(orderId) } })
      if (order.userId != req.user.id) throw new Error('此訂單不屬於您')

      const user = await User.findOne({ where: { id: order.userId } })
      const data = {
        MerchantID: MERCHANTID, // 商店代號
        RespondType: 'JSON', // 回傳格式
        TimeStamp: timeStamp, // 時間戳記
        Version: VERSION, // 串接程式版本
        MerchantOrderNo: orderId, // 訂單號碼
        Amt: parseInt(order.total), // 訂單金額
        ItemDesc: order.comments, // 訂單描述
        Email: user.Email, // 付款人電子信箱
        ReturnURL: RETURNURL, // 支付完成返回商店網址
        NotifyURL: NOTIFYURL, // 支付通知網址/每期授權結果通知
        ClientBackURL: `${CORS_ORIGIN}/store`, // 付款完成返回商店網址
        LoginType: 0, // 0=不須藍新會員登入
        OrderComment: 'OrderComment 測試測試', // 商店備註
      }
      const TradeInfo = createSesEncrypt(data)
      console.log('藍新交易資料 :', TradeInfo)
      const TradeSha = createShaEncrypt(TradeInfo)
      console.log('藍新SHA檢查碼 :', TradeSha)

      cb(null, {
        MerchantID: MERCHANTID,
        TradeInfo,
        TradeSha,
        Version: VERSION,
        PayGateWay: PAYGATEWAY,
        MerchantOrderNo: orderId,
      })
    } catch (err) {
      cb(err)
    }
  },
  newebpay_notify: async (req, cb) => {
    try {
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
