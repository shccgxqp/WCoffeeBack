if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const passport = require('./config/passport')

const { apis } = require('./routes')
const port = process.env.PORT || 3060

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
)

app.use(
  session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())
app.use('/images', express.static('upload'))
app.get('/status', (request, response) => {
  const status = { Status: 'Running' }
  response.json(status)
})

app.use('/api', apis)

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
