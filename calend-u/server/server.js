const express = require("express");
const cors = require("cors");
const availabilityRoutes = require("./routes/availability");
const mongoose = require("mongoose");
require("dotenv").config();
require("./models/booking");
const authRoutes = require("./routes/auth");
// server.js (o app.js)
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/availability", availabilityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Calend-U API running 🚀" });
});

const PORT = process.env.PORT || 5002;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));