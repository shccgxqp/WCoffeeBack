if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

const { apis } = require('./routes')
const port = process.env.PORT || 3060

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
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
