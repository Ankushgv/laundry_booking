const Booking = require('../models/bookingModel')
const mongoose = require('mongoose')

//Get All
const getBookings = async (req,res) => {
    const bookings = await Booking.find({})//.sort({createdAt: -1})
    res.status(200).json(bookings)
}

//Get Single
const getBooking = async (req,res) => {
    const {id} = req. params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No booking found'})
    }

    const booking = await Booking.findById(id)
    if (!booking) {
        return res.status(404).json({error: 'No booking found'})
    }
    res.status(200).json(booking)
}

//Create New
const newBooking = async (req,res) => {
    // res.json({msg: 'POST METHOD'})
    const {fullname, email, password} = req.body
    try {
        const booking = await Booking.create({fullname: 'Ankush', email: 'Test', password: '123456'})
        res.status(200).json(booking)
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

//Delete
const deleteBooking = async (req,res) => {
    const {id} = req.params 
    const booking = await Booking.findOneAndDelete({_id: id})
    if (!booking) {
        return res.status(404).json({error: 'No booking found'})
    }
    res.status(200).json(booking)
}

//Update
const updateBooking = async (req,res) => {
    const {id} = req.body
    const booking = await Booking.findByIdAndUpdate({_id: id})
    if (!booking) {
        res.status(404).json({error: 'No booking found'})
    }
    res.status(200).json(booking)
}

module.exports = {
    getBookings,
    getBooking,
    newBooking,
    deleteBooking,
    updateBooking
}