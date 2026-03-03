const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // utente che riceve la prenotazione (il proprietario del calendario)
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // dati ospite (non serve account)
    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    guestEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // momento preciso prenotato
    start: {
      type: Date,
      required: true,
    },

    end: {
      type: Date,
      required: true,
    },

    // opzionale: nota/messaggio dell’ospite
    notes: {
      type: String,
      default: "",
      trim: true,
    },

    // stato (utile per futuro: cancellazioni, no-show, ecc.)
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// indicizzazione utile per query + conflitti (host + start/end)
bookingSchema.index({ host: 1, start: 1, end: 1 });

module.exports = mongoose.model("booking", bookingSchema);