import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

import registerRoutes from "./src/routes/registerRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.send("Laundry API Running...");
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
