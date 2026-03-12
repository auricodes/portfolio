import { Link } from "react-router-dom";

function FlightCard({ flight }) {
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
    <div className="flight-card">
      <div className="flight-card-top">
        <span className="flight-badge">Available</span>
        <span className="flight-price">€{flight.price}</span>
      </div>

      <h3 className="flight-route">
        {flight.from} → {flight.to}
      </h3>

      <p className="flight-date">
        <strong>Date:</strong> {departureDate}
      </p>

      <div className="flight-times">
        <div>
          <span className="flight-label">Departure</span>
          <span>{departureTime}</span>
        </div>

        <div>
          <span className="flight-label">Arrival</span>
          <span>{arrivalTime}</span>
        </div>
      </div>

      <p className="flight-seats">
        <strong>Seats available:</strong> {flight.seatsAvailable}
      </p>

      <Link
  to={`/flights/${flight.id}`}
  state={{ destination: flight.to }}
  className="details-link"
>
  View Details
</Link>
    </div>
  );
}

export default FlightCard;