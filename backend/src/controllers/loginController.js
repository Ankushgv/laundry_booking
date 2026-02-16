import User from '../models/usersModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    try {
        console.log("Login attempt for:", req.body.email);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        // Find user (case-insensitive)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for:", email);
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Return same format as register controller
        console.log("Login successful:", email);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Server error. Please try again." 
        });
    }
}

export default login;