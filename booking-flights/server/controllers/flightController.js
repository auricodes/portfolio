const fakeFlights = require("../data/flights");

const getAllFlights = (req, res) => {
  res.status(200).json(fakeFlights);
};

const getFlightById = (req, res) => {
  const { id } = req.params;

  const flight = fakeFlights.find((flight) => flight.id === id);

  if (!flight) {
    return res.status(404).json({ message: "Flight not found" });
  }

  res.status(200).json(flight);
};

const searchFlights = (req, res) => {
  const { from, to, date } = req.query;

  let filteredFlights = fakeFlights;

  if (from) {
    filteredFlights = filteredFlights.filter(
      (flight) => flight.from.toLowerCase() === from.toLowerCase()
    );
  }

  if (to) {
    filteredFlights = filteredFlights.filter(
      (flight) => flight.to.toLowerCase() === to.toLowerCase()
    );
  }

  if (date) {
    filteredFlights = filteredFlights.filter((flight) => {
      const flightDate = new Date(flight.departureTime).toISOString().split("T")[0];
      return flightDate === date;
    });
  }

  res.status(200).json(filteredFlights);
};

module.exports = {
  getAllFlights,
  getFlightById,
  searchFlights,
};