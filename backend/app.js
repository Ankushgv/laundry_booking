require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bookingRoutes = require('./src/routes/bookingRoutes')

// express app
const app = express()

// middleware to read json
app.use(express.json())

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// router middleware
app.use('/api', bookingRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // start the server and listen to port
        app.listen(process.env.PORT, ()=> {
            console.log("Connected to DB and listensing to port", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })



