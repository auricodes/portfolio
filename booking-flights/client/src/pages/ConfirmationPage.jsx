import { Link, useLocation } from "react-router-dom";

function ConfirmationPage() {
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <h1>No booking found</h1>
          <p>No booking data was provided.</p>
        <Link to="/search" className="primary-button">
            Back to Search
        </Link>
        </div>
      </div>
    );
  }

  const { flight, passengers, passengerDetails, totalPrice, status, extras } =
    bookingData;

  const departureDateObj = new Date(flight.departureTime);
  const arrivalDateObj = new Date(flight.arrivalTime);

  const departureDate = departureDateObj.toLocaleDateString();
  const departureTime = departureDateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const arrivalTime = arrivalDateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const gate = `G${(flight.id || "01").replace("FL", "")}`;
  const bookingReference = `BK${flight.id}${passengers}`;

  const getSeatNumber = (index) => {
    const row = 12 + index;
    const letters = ["A", "B", "C", "D", "E", "F"];
    return `${row}${letters[index % letters.length]}`;
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="section-header">
          <h1>Booking Confirmed</h1>
          <span className="status-badge paid">{status}</span>
        </div>

        <p className="confirmation-subtitle">
          Your flight has been booked successfully.
        </p>

        <div className="confirmation-route">
          {flight.from} → {flight.to}
        </div>

        <div className="confirmation-highlight">
          <span>Total Paid</span>
          <strong>€{totalPrice}</strong>
        </div>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span>Date</span>
            <span>{departureDate}</span>
          </div>

          <div className="confirmation-row">
            <span>Departure</span>
            <span>{departureTime}</span>
          </div>

          <div className="confirmation-row">
            <span>Arrival</span>
            <span>{arrivalTime}</span>
          </div>

          <div className="confirmation-row">
            <span>Passengers</span>
            <span>{passengers}</span>
          </div>

          <div className="confirmation-row">
            <span>Status</span>
            <span className="status-paid">{status}</span>
          </div>
        </div>

        <div className="tickets-wrapper">
          <h2 className="tickets-title">Digital Boarding Passes</h2>

          {passengerDetails?.map((passenger, index) => (
            <div key={index} className="ticket-card">
            <div className="ticket-top">
  <div>
    <p className="ticket-label">Digital Ticket</p>
    <h2 className="ticket-route">
      {flight.from} → {flight.to}
    </h2>

    <div className="ticket-airport-codes">
      <span>
        {flight.fromAirportCode} → {flight.toAirportCode}
      </span>
    </div>
  </div>
  <span className="ticket-status">Boarding Pass</span>
</div>

              <div className="ticket-passenger-name">
                {passenger.firstName} {passenger.lastName}
              </div>

              <div className="ticket-grid">
                <div className="ticket-item">
                  <span className="ticket-item-label">Date</span>
                  <strong>{departureDate}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Gate</span>
                  <strong>{gate}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Departure</span>
                  <strong>{departureTime}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Arrival</span>
                  <strong>{arrivalTime}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Booking Ref</span>
                  <strong>{bookingReference}-{index + 1}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Seat</span>
                  <strong>
                    {passenger.selectedSeat &&
                    passenger.selectedSeat !== "Auto-assigned"
                      ? passenger.selectedSeat
                      : getSeatNumber(index)}
                  </strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Cabin Bag</span>
                  <strong>Included</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Status</span>
                  <strong>{status}</strong>
                </div>
              </div>

              <div className="barcode-section">
                <div className="fake-barcode" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                  <span className="wide"></span>
                  <span className="thin"></span>
                  <span></span>
                  <span className="wide"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                  <span></span>
                  <span className="wide"></span>
                  <span className="thin"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span className="wide"></span>
                  <span></span>
                  <span></span>
                  <span className="thin"></span>
                  <span className="wide"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                  <span className="wide"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                </div>

                <p className="barcode-code">
                  {bookingReference}-{index + 1}-
                  {passenger.selectedSeat &&
                  passenger.selectedSeat !== "Auto-assigned"
                    ? passenger.selectedSeat
                    : getSeatNumber(index)}
                </p>
              </div>
            </div>
          ))}

          {extras?.hasChild && (
            <div className="ticket-card special-ticket child-ticket">
            <div className="ticket-top">
  <div>
    <p className="ticket-label">Child Travel Ticket</p>
    <h2 className="ticket-route">
      {flight.from} → {flight.to}
    </h2>

    <div className="ticket-airport-codes">
      <span>
        {flight.fromAirportCode} → {flight.toAirportCode}
      </span>
    </div>
  </div>
  <span className="ticket-status">Child</span>
</div>

              <div className="ticket-passenger-name">{extras.childName}</div>

              <div className="ticket-grid">
                <div className="ticket-item">
                  <span className="ticket-item-label">Date</span>
                  <strong>{departureDate}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Gate</span>
                  <strong>{gate}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Departure</span>
                  <strong>{departureTime}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Arrival</span>
                  <strong>{arrivalTime}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Type</span>
                  <strong>Child Passenger</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Supplement</span>
                  <strong>€{extras.childSupplement}</strong>
                </div>
              </div>

              <div className="barcode-section">
                <div className="fake-barcode" aria-hidden="true">
                  <span></span>
                  <span className="wide"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                  <span className="wide"></span>
                  <span></span>
                  <span></span>
                  <span className="thin"></span>
                  <span className="wide"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                  <span></span>
                  <span className="wide"></span>
                  <span></span>
                </div>

                <p className="barcode-code">
                  {bookingReference}-CHILD
                </p>
              </div>
            </div>
          )}

          {extras?.hasPet && (
            <div className="ticket-card special-ticket pet-ticket">
    <div className="ticket-top">
  <div>
    <p className="ticket-label">Pet Travel Ticket</p>
    <h2 className="ticket-route">
      {flight.from} → {flight.to}
    </h2>

    <div className="ticket-airport-codes">
      <span>
        {flight.fromAirportCode} → {flight.toAirportCode}
      </span>
    </div>
  </div>
  <span className="ticket-status">Pet</span>
</div>

              <div className="ticket-passenger-name">{extras.petType}</div>

              <div className="ticket-grid">
                <div className="ticket-item">
                  <span className="ticket-item-label">Date</span>
                  <strong>{departureDate}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Gate</span>
                  <strong>{gate}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Departure</span>
                  <strong>{departureTime}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Arrival</span>
                  <strong>{arrivalTime}</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Type</span>
                  <strong>Pet On Board</strong>
                </div>

                <div className="ticket-item">
                  <span className="ticket-item-label">Supplement</span>
                  <strong>€{extras.petSupplement}</strong>
                </div>
              </div>

              <div className="barcode-section">
                <div className="fake-barcode" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span className="thin"></span>
                  <span className="wide"></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                  <span className="wide"></span>
                  <span></span>
                  <span></span>
                  <span className="thin"></span>
                  <span className="wide"></span>
                  <span></span>
                  <span></span>
                  <span className="thin"></span>
                  <span></span>
                </div>

                <p className="barcode-code">
                  {bookingReference}-PET
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="primary-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;