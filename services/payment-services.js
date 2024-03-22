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
      const orderId = parseInt(req.params.orderId)
      const order = await Order.findOne({ where: { id: orderId } })
      if (order.userId != req.user.id) throw new Error('此訂單不屬於您')
      const user = await User.findOne({ where: { id: order.userId } })
      order.merchant_order_no = Date.now()

      const data = {
        MerchantID: MERCHANTID, // 商店代號
        RespondType: 'JSON', // 回傳格式
        TimeStamp: Date.now(), // 時間戳記
        Version: VERSION, // 串接程式版本
        MerchantOrderNo: Date.now(), // 訂單號碼
        Amt: parseInt(order.total), // 訂單金額
        ItemDesc: 'ItemDesc 測試', // 訂單描述
        Email: user.email, // 付款人電子信箱
        ReturnURL: `${CORS_ORIGIN}/user/order/details/${orderId}`, // 支付完成返回商店網址
        NotifyURL: NOTIFYURL, // 支付通知網址/每期授權結果通知
        ClientBackURL: `${CORS_ORIGIN}/user/order/details/${orderId}`, //暫時返回商店網址
        LoginType: 0, // 0=不須藍新會員登入
        OrderComment: 'OrderComment 測試測試', // 商店備註
      }
      await order.save()
      console.log('更新資料 :', order.merchant_order_no)
      const TradeInfo = createSesEncrypt(data)
      const TradeSha = createShaEncrypt(TradeInfo)
      cb(null, {
        ...data,
        PayGateWay: PAYGATEWAY,
        TradeInfo,
        TradeSha,
      })
    } catch (err) {
      cb(err)
    }
  },
  newebpay_notify: async (req, cb) => {
    try {
      // const from = req.params.from
      // if (from === 'ReturnURL')
      //   return res.redirect('https://wcoffeefront.zeabur.app/user/order/result')
      const response = req.body
      const data = createSesDecrypt(response.TradeInfo)
      const shaEncrypt = createShaEncrypt(response.TradeInfo)
      if (!shaEncrypt === response.TradeSha) return res.end()
      console.log('callback data:', data)
      console.log('callback :', data.Result.MerchantOrderNo)
      const order = await Order.findOne({
        where: { merchant_order_no: data.Result.MerchantOrderNo },
      })
      if (data.Status === 'SUCCESS') {
        order.payment_status = '已付款'
        order.payment_type = data.Result.PaymentType
      } else if (data.Status === 'MPG03009') order.payment_status = '付款失敗'
      else console.log('付款失敗：未知狀態', data.Status)

      if (data.PaymentType === 'WEBATM') {
        order.payment_bank = data.Result.PayBankCode
        order.payment_act = data.Result.PayerAccount5Code
      }
      if (data.PaymentType === 'CREDIT') {
        order.payment_bank = data.Result.AuthBank
        order.payment_act = data.Result.Card6No + data.Result.Card4No
      }
      await order.save()

      cb(null, { data })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = paymentServices
