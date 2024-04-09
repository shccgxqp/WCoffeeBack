const express = require('express')
const router = express.Router()

// 定義路由處理函式
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
