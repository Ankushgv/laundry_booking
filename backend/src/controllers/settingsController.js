import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    console.log("Fetching profile for:", req.user.email);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Return user without password
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      message: "Failed to fetch profile",
      error: error.message 
    });
  }
};

// Update email address
export const updateEmail = async (req, res) => {
  try {
    console.log("Updating email for:", req.user.email);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and current password are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Verify current password
    const user = await User.findById(req.user._id);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Current password is incorrect" 
      });
    }

    // Check if email is already taken by another user
    const emailExists = await User.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: req.user._id }
    });

    if (emailExists) {
      return res.status(400).json({ 
        message: "This email is already in use" 
      });
    }

    // Update email
    user.email = email.toLowerCase();
    await user.save();

    console.log("Email updated successfully to:", email);
    res.json({
      message: "Email updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({ 
      message: "Failed to update email",
      error: error.message 
    });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    console.log("Updating password for:", req.user.email);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: "All password fields are required" 
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        message: "New passwords do not match" 
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters long" 
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Current password is incorrect" 
      });
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        message: "New password must be different from current password" 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("Password updated successfully for:", user.email);
    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ 
      message: "Failed to update password",
      error: error.message 
    });
  }
};

// Update name
export const updateName = async (req, res) => {
  try {
    console.log("Updating name for:", req.user.email);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name } = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        message: "Name is required" 
      });
    }

    // Update name
    const user = await User.findById(req.user._id);
    user.name = name.trim();
    await user.save();

    console.log("Name updated successfully to:", name);
    res.json({
      message: "Name updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Update name error:", error);
    res.status(500).json({ 
      message: "Failed to update name",
      error: error.message 
    });
  }
};