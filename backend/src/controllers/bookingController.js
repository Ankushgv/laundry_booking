import Booking from "../models/bookingModel.js";

export const createBooking = async (req, res) => {
  try {
    console.log("Creating booking for user:", req.user?.email);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { bookingDate, bookingTime, duration } = req.body;

    // Validate required fields
    if (!bookingDate || !bookingTime) {
      return res.status(400).json({ 
        message: "Please provide both date and time for booking" 
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      bookingDate,
      bookingTime,
      duration: duration || 3,
    });

    console.log("Booking created successfully:", booking._id);
    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ 
      message: "Failed to create booking",
      error: error.message 
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    console.log("Fetching bookings for user:", req.user?.email);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .sort({ bookingDate: -1 });

    console.log("Found", bookings.length, "bookings");
    res.json(bookings);

  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ 
      message: "Failed to fetch bookings",
      error: error.message 
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    console.log("Deleting booking:", req.params.id);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Not authorized to delete this booking" 
      });
    }

    await Booking.findByIdAndDelete(req.params.id);
    console.log("Booking deleted successfully");
    res.json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ 
      message: "Failed to delete booking",
      error: error.message 
    });
  }
};