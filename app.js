const express = require('express')
const app = express()

require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('./config/passport')

const { apis } = require('./routes')
const port = process.env.PORT || 3060

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

corsOptions = [
  'http://localhost:3000',
  'http://localhost:3060',
  'https://wcoffeeback.zeabur.app',
  'https://wcoffeefront.zeabur.app',
  'https://ccore.newebpay.com',
  'https://core.newebpay.com',
]
app.use(
  cors({
    origin: corsOptions,
    credentials: true,
    maxAge: 3600,
  })
)

app.use(
  session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use('/upload', express.static('upload'))
app.use('/api', apis)

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})

module.exports = app
