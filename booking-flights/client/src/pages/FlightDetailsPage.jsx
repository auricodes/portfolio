import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFlightById } from "../services/flightService";

function FlightDetailsPage() {
  const { id } = useParams();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadFlightDetails = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await getFlightById(id);
        setFlight(data);
      } catch (error) {
        console.error("Error loading flight details:", error);
        setMessage("Flight not found.");
      } finally {
        setLoading(false);
      }
    };

    loadFlightDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-card">
          <p>Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="details-page">
        <div className="details-card">
          <Link to="/search" className="back-link">
            ← Back to flights
          </Link>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  const departureDate = new Date(flight.departureTime).toLocaleDateString();
  const departureTime = new Date(flight.departureTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const arrivalTime = new Date(flight.arrivalTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="details-page">
      <div className="details-card">
        <Link to="/search" className="back-link">
          ← Back to flights
        </Link>

        <h1>
          {flight.from} → {flight.to}
        </h1>
        <div className="airport-code-row">
  {flight.fromAirportCode} → {flight.toAirportCode}
</div>

        <p className="details-date">
          <strong>Date:</strong> {departureDate}
        </p>

        <div className="details-grid">
          <div className="details-item">
            <span className="details-label">Departure</span>
            <span>{departureTime}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Arrival</span>
            <span>{arrivalTime}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Price</span>
            <span>€{flight.price}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Seats Available</span>
            <span>{flight.seatsAvailable}</span>
          </div>
        </div>

        <div className="details-actions">
          <Link to={`/booking/${flight.id}`} className="primary-button">
            Book This Flight
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FlightDetailsPage;