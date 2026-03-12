import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

function SeatSelectionPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="seat-page">
        <div className="seat-card">
          <h1>No seat selection data found</h1>
          <p>Please go back to the booking page.</p>
          <Link to={`/booking/${id}`} className="primary-button">
            Back to Booking
          </Link>
        </div>
      </div>
    );
  }

const {
  destination,
  flight,
  passengers,
  passengerDetails,
  hasChild,
  childName,
  hasPet,
  petType,
  addCheckedBaggage,
  baggageType,
} = bookingData;

  const initialPassengers = passengerDetails.map((passenger) => ({
    ...passenger,
    selectedSeat: passenger.selectedSeat === "Auto-assigned" ? "" : passenger.selectedSeat,
  }));

  const [updatedPassengers, setUpdatedPassengers] = useState(initialPassengers);
  const [activePassengerIndex, setActivePassengerIndex] = useState(() => {
    const firstManualIndex = initialPassengers.findIndex(
      (passenger) => passenger.chooseSeat
    );
    return firstManualIndex >= 0 ? firstManualIndex : 0;
  });

  const manualPassengerIndexes = useMemo(() => {
    return updatedPassengers
      .map((passenger, index) => (passenger.chooseSeat ? index : null))
      .filter((value) => value !== null);
  }, [updatedPassengers]);

  const occupiedSeats = useMemo(() => {
    return updatedPassengers
      .filter((passenger) => passenger.selectedSeat)
      .map((passenger) => passenger.selectedSeat);
  }, [updatedPassengers]);

  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const leftSeats = ["A", "B", "C"];
  const rightSeats = ["D", "E", "F"];

  const currentPassenger = updatedPassengers[activePassengerIndex];

  const handleSeatClick = (seatCode) => {
    if (!currentPassenger?.chooseSeat) return;

    const isAlreadyTakenByAnotherPassenger = updatedPassengers.some(
      (passenger, index) =>
        index !== activePassengerIndex && passenger.selectedSeat === seatCode
    );

    if (isAlreadyTakenByAnotherPassenger) return;

    const newPassengers = [...updatedPassengers];
    newPassengers[activePassengerIndex] = {
      ...newPassengers[activePassengerIndex],
      selectedSeat: seatCode,
    };

    setUpdatedPassengers(newPassengers);

    const nextPassengerIndex = manualPassengerIndexes.find((index) => {
      return (
        index !== activePassengerIndex &&
        newPassengers[index].chooseSeat &&
        !newPassengers[index].selectedSeat
      );
    });

    if (nextPassengerIndex !== undefined) {
      setActivePassengerIndex(nextPassengerIndex);
    }
  };

  const isSeatSelectedByCurrentPassenger = (seatCode) => {
    return currentPassenger?.selectedSeat === seatCode;
  };

  const isSeatTaken = (seatCode) => {
    return occupiedSeats.includes(seatCode);
  };

  const allManualSeatsSelected = manualPassengerIndexes.every(
    (index) => updatedPassengers[index].selectedSeat
  );

  const handleSaveSeats = () => {
    if (!allManualSeatsSelected) return;

    navigate(`/booking/${id}`, {
  state: {
    destination,
    flight,
    passengers,
    passengerDetails: updatedPassengers.map((passenger) => ({
      ...passenger,
      selectedSeat: passenger.chooseSeat
        ? passenger.selectedSeat
        : "Auto-assigned",
    })),
    hasChild,
    childName,
    hasPet,
    petType,
    addCheckedBaggage,
    baggageType,
    seatsConfirmed: true,
  },
});
  };

  return (
    <div className="seat-page">
      <div className="seat-card">
        <Link to={`/booking/${id}`} className="back-link">
          ← Back to booking
        </Link>

        <div className="section-header">
          <h1>Select Your Seats</h1>
          <span className="status-badge pending">seat selection</span>
        </div>

        <p className="seat-subtitle">
          Choose a seat for each passenger who requested manual seat selection.
        </p>

        <div className="seat-selection-layout">
          <div className="seat-passenger-panel">
            <h2>Passengers</h2>

            {updatedPassengers.map((passenger, index) => (
              <button
                key={index}
                type="button"
                className={`seat-passenger-item ${
                  activePassengerIndex === index ? "active" : ""
                } ${!passenger.chooseSeat ? "disabled" : ""}`}
                onClick={() => passenger.chooseSeat && setActivePassengerIndex(index)}
              >
                <div>
                  <strong>
                    Passenger {index + 1}: {passenger.firstName} {passenger.lastName}
                  </strong>
                  <p>
                    {passenger.chooseSeat
                      ? passenger.selectedSeat
                        ? `Seat selected: ${passenger.selectedSeat}`
                        : "Seat not selected yet"
                      : "Auto-assigned seat"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="plane-wrapper">
            <div className="plane-head">Front of Aircraft</div>

            <div className="plane-cabin">
              {rows.map((row) => (
                <div key={row} className="plane-row">
                  <div className="plane-seat-group">
                    {leftSeats.map((letter) => {
                      const seatCode = `${row}${letter}`;
                      const isSelected = isSeatSelectedByCurrentPassenger(seatCode);
                      const taken = isSeatTaken(seatCode);

                      return (
                        <button
                          key={seatCode}
                          type="button"
                          className={`plane-seat ${
                            isSelected ? "selected" : ""
                          } ${taken && !isSelected ? "taken" : ""}`}
                          onClick={() => handleSeatClick(seatCode)}
                          disabled={taken && !isSelected}
                        >
                          {seatCode}
                        </button>
                      );
                    })}
                  </div>

                  <div className="plane-aisle">|</div>

                  <div className="plane-seat-group">
                    {rightSeats.map((letter) => {
                      const seatCode = `${row}${letter}`;
                      const isSelected = isSeatSelectedByCurrentPassenger(seatCode);
                      const taken = isSeatTaken(seatCode);

                      return (
                        <button
                          key={seatCode}
                          type="button"
                          className={`plane-seat ${
                            isSelected ? "selected" : ""
                          } ${taken && !isSelected ? "taken" : ""}`}
                          onClick={() => handleSeatClick(seatCode)}
                          disabled={taken && !isSelected}
                        >
                          {seatCode}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="seat-legend">
              <div className="legend-item">
                <span className="legend-box available"></span>
                <span>Available</span>
              </div>

              <div className="legend-item">
                <span className="legend-box selected"></span>
                <span>Selected</span>
              </div>

              <div className="legend-item">
                <span className="legend-box taken"></span>
                <span>Taken</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="primary-button save-seat-button"
          onClick={handleSaveSeats}
          disabled={!allManualSeatsSelected}
        >
          Save Seats and Continue
        </button>
      </div>
    </div>
  );
}

export default SeatSelectionPage;