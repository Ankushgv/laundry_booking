import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        console.log("Token received");

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified");

        const userId = decoded.id || decoded.userId;
        
        if (!userId) {
          console.log("No user ID in token");
          return res.status(401).json({ message: "Invalid token format" });
        }

        // Find user
        req.user = await User.findById(userId).select("-password");

        if (!req.user) {
          console.log("User not found for ID:", userId);
          return res.status(401).json({ message: "User not found" });
        }

        console.log("User authenticated:", req.user.email);
        next();

      } catch (error) {
        console.error("Auth error:", error.message);
        
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid token" });
        }
        
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

  } catch (error) {
    console.error("Unexpected auth error:", error);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};