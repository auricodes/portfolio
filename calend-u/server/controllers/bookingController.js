// controllers/bookingController.js
const Booking = require("../models/booking");

// helper: validazione Date
const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
const Availability = require("../models/availability");
const { generateSlotsForDate } = require("../utils/slotGenerator");
const sameInstant = (a, b) => new Date(a).getTime() === new Date(b).getTime();
/**
 * Crea una prenotazione se non ci sono conflitti per lo stesso host.
 * Regola conflitto:
 * newStart < existingEnd  AND  newEnd > existingStart
 */
exports.createBooking = async (req, res) => {
  try {
    const { host, guestName, guestEmail, start, end, notes } = req.body;

    // 1) Validazioni base
    if (!host || !guestName || !guestEmail || !start || !end) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "End must be after start" });
    }

    // (opzionale ma utile) blocca prenotazioni nel passato
    // if (startDate < new Date()) {
    //   return res.status(400).json({ message: "Cannot book in the past" });
    // }

    // 2) Controllo conflitti SOLO per lo stesso host e SOLO su booking confermate
    const conflict = await Booking.findOne({
      host,
      status: "confirmed",
      start: { $lt: endDate },
      end: { $gt: startDate },
    }).select("_id start end");

    if (conflict) {
      return res.status(409).json({
        message: "Time slot already booked",
        conflict,
      });
    }

    // 3) Crea booking
    const booking = await Booking.create({
      host,
      guestName,
      guestEmail,
      start: startDate,
      end: endDate,
      notes: notes || "",
      status: "confirmed",
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Lista prenotazioni di un host (per calendario)
 * Esempio: GET /api/bookings?host=...&from=...&to=...
 */
exports.getBookingsByHost = async (req, res) => {
  try {
    const { host, from, to, status } = req.query;

    if (!host) {
      return res.status(400).json({ message: "host is required" });
    }

    const query = { host };

    // filtra stato (default: confirmed)
    if (status) query.status = status;
    else query.status = "confirmed";

    // filtra per range (utile per calendario)
    if (from || to) {
      query.start = {};
      if (from) query.start.$gte = new Date(from);
      if (to) query.start.$lte = new Date(to);
    }

    const bookings = await Booking.find(query)
      .sort({ start: 1 })
      .select("-__v");

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Cancella (soft) una prenotazione: status = cancelled
 * PATCH /api/bookings/:id/cancel
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.createBookingFromSlot = async (req, res) => {
  try {
    const { hostId } = req.params;
    const { guestName, guestEmail, start, end, notes } = req.body;

    // 1) Validazioni base
    if (!hostId || !guestName || !guestEmail || !start || !end) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "End must be after start" });
    }

    // 2) Recupero availability del giorno (dayOfWeek) per quel host
    const selectedDate = new Date(startDate);
    const dayOfWeek = selectedDate.getDay(); // coerente col tuo GET /slots

    const availabilities = await Availability.find({ user: hostId, dayOfWeek });

    if (!availabilities || availabilities.length === 0) {
      return res.status(400).json({ message: "Host has no availability for this day" });
    }

    // 3) Genero tutti gli slot di quel giorno (come fai in GET /slots)
    let allSlots = [];
    for (const a of availabilities) {
      allSlots = allSlots.concat(generateSlotsForDate(a, selectedDate));
    }

    // 4) Verifico che lo slot richiesto sia esattamente uno di quelli generati
    const slotExists = allSlots.some(
      (s) => sameInstant(s.start, startDate) && sameInstant(s.end, endDate)
    );

    if (!slotExists) {
      return res.status(400).json({ message: "Requested slot is not available" });
    }

    // 5) Controllo conflitti (overlap) per host su booking confirmed
    const conflict = await Booking.findOne({
      host: hostId,
      status: "confirmed",
      start: { $lt: endDate },
      end: { $gt: startDate },
    }).select("_id start end");

    if (conflict) {
      return res.status(409).json({
        message: "Time slot already booked",
        conflict,
      });
    }

    // 6) Creo booking
    const booking = await Booking.create({
      host: hostId,
      guestName,
      guestEmail,
      start: startDate,
      end: endDate,
      notes: notes || "",
      status: "confirmed",
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};