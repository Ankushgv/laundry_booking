import express from "express";
import { 
  getProfile, 
  updateEmail, 
  updatePassword,
  updateName 
} from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.get("/profile", protect, getProfile);
router.put("/email", protect, updateEmail);
router.put("/password", protect, updatePassword);
router.put("/name", protect, updateName);

export default router;