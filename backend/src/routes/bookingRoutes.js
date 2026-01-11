const express = require('express')
const router = express.Router()
const {getBookings,
    getBooking,
    newBooking,
    deleteBooking,
    updateBooking
} = require('../controllers/bookingController')

// GET
router.get('/', getBookings)

// GET single
router.get('/:id', getBooking)

// POST
router.post('/', newBooking)

// DELETE
router.delete('/:id', deleteBooking)

// PATCH
router.patch('/:id', updateBooking)

module.exports = router;