const express = require("express");
const Availability = require("../models/availability");
const Booking = require("../models/booking");
const authMiddleware = require("../middleware/authMiddleware");
const { generateSlotsForDate } = require("../utils/slotGenerator");

const router = express.Router();

// CREATE AVAILABILITY (protected)
// POST /api/availability
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, slotDuration } = req.body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({
        message: "dayOfWeek, startTime, endTime are required",
      });
    }

    const newAvailability = new Availability({
      user: req.userId,
      dayOfWeek,
      startTime,
      endTime,
      slotDuration: slotDuration || 30,
    });

    await newAvailability.save();
    return res.status(201).json(newAvailability);
  } catch (err) {
  // Duplicate key error (unique index)
  if (err.code === 11000) {
    return res.status(400).json({ message: "Availability already exists" });
  }
  return res.status(500).json({ message: "Server error", error: err.message });
}
});

// LIST AVAILABILITIES (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const list = await Availability.find({ user: req.userId })
      .sort({ dayOfWeek: 1, startTime: 1 });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE AVAILABILITY (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Availability.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Availability not found" });

    return res.json({ message: "Availability deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET SLOTS (public for guests, requires hostId)
// GET /api/availability/slots?hostId=...&date=YYYY-MM-DD
router.get("/slots", async (req, res) => {
  try {
    const { hostId, date } = req.query;

    if (!hostId || !date) {
      return res.status(400).json({ message: "hostId and date are required" });
    }

    const selectedDate = new Date(date);
    console.log("DEBUG date param:", date);
    console.log("DEBUG selectedDate:", selectedDate.toString());
    console.log("DEBUG dayOfWeek:", selectedDate.getDay());
    console.log("DEBUG hostId:", hostId);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    const dayOfWeek = selectedDate.getDay();

    const availabilities = await Availability.find({ user: hostId, dayOfWeek });

    let allSlots = [];
    for (const a of availabilities) {
      allSlots = allSlots.concat(generateSlotsForDate(a, selectedDate));
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      host: hostId,
      status: "confirmed",
      start: { $gte: startOfDay, $lte: endOfDay },
    });

    const bookedStarts = new Set(bookings.map((b) => b.start.toISOString()));
    const availableSlots = allSlots.filter((s) => !bookedStarts.has(s.start.toISOString()));

    return res.json(
      availableSlots.map((s) => ({
        start: s.start,
        end: s.end,
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;