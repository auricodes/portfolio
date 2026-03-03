// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookingsByHost,
  cancelBooking,
  createBookingFromSlot, 
} = require("../controllers/bookingController");

// Crea booking + check conflitti (versione "generica", con host nel body)
router.post("/", createBooking);

// Lista booking di un host (per calendario)
router.get("/", getBookingsByHost);

// Soft-cancel
router.patch("/:id/cancel", cancelBooking);

// prenota uno slot specifico per un host
router.post("/hosts/:hostId/slot", createBookingFromSlot);

module.exports = router;