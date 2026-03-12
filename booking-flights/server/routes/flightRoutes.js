const express = require("express");
const router = express.Router();

const {
  getAllFlights,
  getFlightById,
  searchFlights,
} = require("../controllers/flightController");

router.get("/", getAllFlights);
router.get("/search", searchFlights);
router.get("/:id", getFlightById);

module.exports = router;