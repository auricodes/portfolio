const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const flightRoutes = require("./routes/flightRoutes");
app.use("/api/flights", flightRoutes);

app.get("/", (req, res) => {
  res.send("Booking Flights API is running...");
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});