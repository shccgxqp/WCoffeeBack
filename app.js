const express = require("express");
const app = express()

const { apis } = require('./routes')
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/status", (request, response) => {
  const status = { Status: "Running", }
  response.send(status)
})

app.use('/api', apis)

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
