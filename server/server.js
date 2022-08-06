require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {seeds,startClock, checkinDetails, endsClocks, checkoutDetails} = require('./controller.js')
const {getNews} = require('./controllerTwo');

app.use(cors())
app.use(express.json())

app.post('/seeds', seeds)

app.post('/clock', startClock)

app.post('/ends', endsClocks)

app.get('/details', checkinDetails)

app.get('/out', checkoutDetails)

app.get('/api/news',getNews)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))

