import express from "express";
import { 
  createBooking, 
  getBookings, 
  deleteBooking 
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", protect, createBooking);
router.get("/", protect, getBookings);
router.delete("/:id", protect, deleteBooking);

export default router;
