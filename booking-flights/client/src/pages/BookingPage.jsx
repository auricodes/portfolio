import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { getFlightById } from "../services/flightService";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.destination;

  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([
    {
      firstName: "",
      lastName: "",
      chooseSeat: false,
      selectedSeat: "Auto-assigned",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hasChild, setHasChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [hasPet, setHasPet] = useState(false);
  const [petType, setPetType] = useState("");
  const [addCheckedBaggage, setAddCheckedBaggage] = useState(false);
  const [baggageType, setBaggageType] = useState("");

  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [paymentError, setPaymentError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const loadFlight = async () => {
      try {
        setLoading(true);
        const data = await getFlightById(id);
        setFlight(data);
      } catch (err) {
        console.error("Error loading flight:", err);
        setError("Flight not found.");
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [id]);

  useEffect(() => {
    if (!location.state) return;

    const {
      passengerDetails: returnedPassengerDetails,
      hasChild: returnedHasChild,
      childName: returnedChildName,
      hasPet: returnedHasPet,
      petType: returnedPetType,
      addCheckedBaggage: returnedAddCheckedBaggage,
      baggageType: returnedBaggageType,
      seatsConfirmed,
    } = location.state;

    if (returnedPassengerDetails) {
      setPassengerDetails(returnedPassengerDetails);
      setPassengers(returnedPassengerDetails.length);
    }

    if (typeof returnedHasChild === "boolean") {
      setHasChild(returnedHasChild);
    }

    if (typeof returnedChildName === "string") {
      setChildName(returnedChildName);
    }

    if (typeof returnedHasPet === "boolean") {
      setHasPet(returnedHasPet);
    }

    if (typeof returnedPetType === "string") {
      setPetType(returnedPetType);
    }

    if (typeof returnedAddCheckedBaggage === "boolean") {
      setAddCheckedBaggage(returnedAddCheckedBaggage);
    }

    if (typeof returnedBaggageType === "string") {
      setBaggageType(returnedBaggageType);
    }

    if (seatsConfirmed) {
      setShowPaymentStep(true);
      setShowPaymentForm(true);
    }
  }, [location.state]);

  const resetNextSteps = () => {
    setShowPaymentStep(false);
    setShowPaymentForm(false);
    setPaymentSuccess(false);
    setPaymentError("");
  };

  const handlePassengersChange = (e) => {
    const value = Number(e.target.value);

    if (!flight) return;

    if (value < 1) {
      setPassengers(1);
      setPassengerDetails([
        {
          firstName: "",
          lastName: "",
          chooseSeat: false,
          selectedSeat: "Auto-assigned",
        },
      ]);
      setError("");
      resetNextSteps();
      return;
    }

    if (value > flight.seatsAvailable) {
      setError("Not enough seats available.");
      resetNextSteps();
      return;
    }

    setError("");
    setPassengers(value);

    setPassengerDetails((prev) => {
      const updated = [...prev];

      if (value > updated.length) {
        while (updated.length < value) {
          updated.push({
            firstName: "",
            lastName: "",
            chooseSeat: false,
            selectedSeat: "Auto-assigned",
          });
        }
      } else {
        updated.length = value;
      }

      return updated;
    });

    resetNextSteps();
  };

  const handlePassengerDetailChange = (index, field, value) => {
    setPassengerDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });

    setError("");
    resetNextSteps();
  };

  const handleChooseSeatToggle = (index) => {
    setPassengerDetails((prev) => {
      const updated = [...prev];
      const currentValue = updated[index].chooseSeat;

      updated[index] = {
        ...updated[index],
        chooseSeat: !currentValue,
        selectedSeat: !currentValue ? "" : "Auto-assigned",
      };

      return updated;
    });

    setError("");
    resetNextSteps();
  };

  const arePassengerDetailsValid = () => {
    return passengerDetails.every(
      (passenger) =>
        passenger.firstName.trim() !== "" && passenger.lastName.trim() !== ""
    );
  };

  const areExtraDetailsValid = () => {
    if (hasChild && childName.trim() === "") {
      setError("Please enter the child's name.");
      return false;
    }

    if (hasPet && petType.trim() === "") {
      setError("Please select a pet type.");
      return false;
    }

    if (addCheckedBaggage && baggageType === "") {
      setError("Please select a checked baggage option.");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (error === "Not enough seats available.") return;

    if (!arePassengerDetailsValid()) {
      setError("Please fill in all passenger details.");
      return;
    }

    if (!areExtraDetailsValid()) {
      return;
    }

    setError("");
    setShowPaymentStep(true);
    setShowPaymentForm(false);
    setPaymentSuccess(false);
    setPaymentError("");
  };

  const handleOpenPaymentForm = () => {
    const needsManualSeatSelection = passengerDetails.some(
      (passenger) => passenger.chooseSeat && !passenger.selectedSeat
    );

    if (needsManualSeatSelection) {
     navigate(`/seat-selection/${id}`, {
  state: {
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
  },
});
      return;
    }

    setShowPaymentForm(true);
    setPaymentSuccess(false);
    setPaymentError("");
  };

  const handlePayNow = () => {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setPaymentError("Please fill in all payment fields.");
      return;
    }

    if (cardNumber.length < 16) {
      setPaymentError("Card number must be at least 16 digits.");
      return;
    }

    if (cvv.length < 3) {
      setPaymentError("CVV must be at least 3 digits.");
      return;
    }

    setPaymentError("");
    setIsPaying(true);

    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const seatSelectionCount = passengerDetails.filter(
    (passenger) => passenger.chooseSeat
  ).length;

  const baggageSupplement = useMemo(() => {
    if (!addCheckedBaggage) return 0;
    if (baggageType === "15kg") return 25;
    if (baggageType === "20kg") return 35;
    if (baggageType === "23kg") return 45;
    return 0;
  }, [addCheckedBaggage, baggageType]);

  const petSupplement = hasPet ? 30 : 0;
  const childSupplement = hasChild ? 20 : 0;
  const seatSupplement = seatSelectionCount * 12;

  const baseFareTotal = flight ? flight.price * passengers : 0;
  const totalPrice =
    baseFareTotal +
    baggageSupplement +
    petSupplement +
    childSupplement +
    seatSupplement;

  const handleGoToConfirmation = () => {
    navigate("/confirmation", {
      state: {
        flight,
        passengers,
        passengerDetails,
        totalPrice,
        status: "paid",
        extras: {
          cabinBagIncluded: true,
          hasChild,
          childName,
          hasPet,
          petType,
          addCheckedBaggage,
          baggageType,
          seatSelectionCount,
          baggageSupplement,
          petSupplement,
          childSupplement,
          seatSupplement,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="booking-page">
        <p>Loading booking...</p>
      </div>
    );
  }

  if (error && !flight) {
    return (
      <div className="booking-page">
        <p>{error}</p>
        <Link to="/search">Back to flights</Link>
      </div>
    );
  }

  const departureDate = new Date(flight.departureTime).toLocaleDateString();
  const bookingStatus = paymentSuccess ? "paid" : "pending";

  return (
    <div className="booking-page">
        <div className="booking-card">
      <Link to={`/flights/${flight.id}`} className="back-link">
        ← Back to flight details
      </Link>

      
        <div className="section-header">
          <h1>Booking</h1>
          <span className={`status-badge ${bookingStatus}`}>
            {bookingStatus}
          </span>
        </div>

        <div className="booking-flight">
          <h2>
            {flight.from} → {flight.to}
          </h2>

          <p>
            <strong>Date:</strong> {departureDate}
          </p>

          <p>
            <strong>Price per passenger:</strong> €{flight.price}
          </p>

          <p>
            <strong>Seats available:</strong> {flight.seatsAvailable}
          </p>

          <p>
            <strong>Baggage included:</strong> Cabin bag
          </p>
        </div>

        <div className="booking-form">
          <label htmlFor="passengers">Passengers</label>
          <input
            type="number"
            id="passengers"
            min="1"
            max={flight.seatsAvailable}
            value={passengers}
            onChange={handlePassengersChange}
          />
        </div>

        <div className="passenger-details-section">
          <h2>Passenger Details</h2>

          {passengerDetails.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <h3>Passenger {index + 1}</h3>

              <div className="passenger-fields">
                <div className="payment-field">
                  <input
                    type="text"
                    id={`firstName-${index}`}
                    value={passenger.firstName}
                    onChange={(e) =>
                      handlePassengerDetailChange(index, "firstName", e.target.value)
                    }
                    placeholder="First Name"
                  />
                </div>

                <div className="payment-field">
                  <input
                    type="text"
                    id={`lastName-${index}`}
                    value={passenger.lastName}
                    onChange={(e) =>
                      handlePassengerDetailChange(index, "lastName", e.target.value)
                    }
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="extras-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={passenger.chooseSeat}
                    onChange={() => handleChooseSeatToggle(index)}
                  />
                  Choose seat manually (+€12)
                </label>
              </div>

              <p className="seat-preview">
                <strong>Seat:</strong>{" "}
                {passenger.selectedSeat || "Not selected yet"}
              </p>
            </div>
          ))}
        </div>

        <div className="extras-section">
          <h2>Travel Extras</h2>

          <div className="extras-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasChild}
                onChange={(e) => {
                  setHasChild(e.target.checked);
                  if (!e.target.checked) setChildName("");
                  setError("");
                  resetNextSteps();
                }}
              />
              Traveling with a child (+€20)
            </label>
          </div>

          {hasChild && (
            <div className="payment-field">
              <input
                type="text"
                value={childName}
                onChange={(e) => {
                  setChildName(e.target.value);
                  setError("");
                  resetNextSteps();
                }}
                placeholder="Child full name"
              />
            </div>
          )}

          <div className="extras-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasPet}
                onChange={(e) => {
                  setHasPet(e.target.checked);
                  if (!e.target.checked) setPetType("");
                  setError("");
                  resetNextSteps();
                }}
              />
              Traveling with a pet (+€30)
            </label>
          </div>

          {hasPet && (
            <div className="payment-field">
              <select
                value={petType}
                onChange={(e) => {
                  setPetType(e.target.value);
                  setError("");
                  resetNextSteps();
                }}
              >
                <option value="">Select pet type</option>
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
                <option value="Other small pet">Other small pet</option>
              </select>
            </div>
          )}

          <div className="extras-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={addCheckedBaggage}
                onChange={(e) => {
                  setAddCheckedBaggage(e.target.checked);
                  if (!e.target.checked) setBaggageType("");
                  setError("");
                  resetNextSteps();
                }}
              />
              Add checked baggage
            </label>
          </div>

          {addCheckedBaggage && (
            <div className="payment-field">
              <select
                value={baggageType}
                onChange={(e) => {
                  setBaggageType(e.target.value);
                  setError("");
                  resetNextSteps();
                }}
              >
                <option value="">Select baggage option</option>
                <option value="15kg">15 kg (+€25)</option>
                <option value="20kg">20 kg (+€35)</option>
                <option value="23kg">23 kg (+€45)</option>
              </select>
            </div>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          className="primary-button"
          onClick={handleContinue}
          disabled={error === "Not enough seats available."}
        >
          Continue to Payment
        </button>

        {showPaymentStep && (
          <div className="payment-summary">
            <div className="section-header">
              <h2>Payment Summary</h2>
              <span className="status-badge pending">pending</span>
            </div>

            <div className="summary-row">
              <span>Base fare</span>
              <span>€{baseFareTotal}</span>
            </div>

            <div className="summary-row">
              <span>Cabin bag</span>
              <span>Included</span>
            </div>

            <div className="summary-row">
              <span>Seat selection</span>
              <span>€{seatSupplement}</span>
            </div>

            <div className="summary-row">
              <span>Checked baggage</span>
              <span>{addCheckedBaggage ? `€${baggageSupplement}` : "€0"}</span>
            </div>

            <div className="summary-row">
              <span>Child supplement</span>
              <span>{hasChild ? `€${childSupplement}` : "€0"}</span>
            </div>

            <div className="summary-row">
              <span>Pet supplement</span>
              <span>{hasPet ? `€${petSupplement}` : "€0"}</span>
            </div>

            <div className="summary-row total-row">
              <span>Total Price</span>
              <span>€{totalPrice}</span>
            </div>

            {!showPaymentForm && !paymentSuccess && (
              <button
                className="primary-button fake-pay-button"
                onClick={handleOpenPaymentForm}
              >
                {seatSelectionCount > 0
                  ? "Go to Seat Selection / Payment"
                  : "Proceed to Fake Payment"}
              </button>
            )}
          </div>
        )}

        {showPaymentForm && !paymentSuccess && (
          <div className="fake-payment-form">
            <div className="section-header">
              <h2>Fake Payment</h2>
              <span className="status-badge pending">pending</span>
            </div>

            <div className="payment-field">
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name"
              />
            </div>

            <div className="payment-field">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234567812345678"
              />
            </div>

            <div className="payment-inline-fields">
              <div className="payment-field">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="12/28"
                />
              </div>

              <div className="payment-field">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>

            {paymentError && <p className="error-text">{paymentError}</p>}

            <button
              className="primary-button fake-pay-button"
              onClick={handlePayNow}
              disabled={isPaying}
            >
              {isPaying ? "Processing Payment..." : "Pay Now"}
            </button>
          </div>
        )}

        {paymentSuccess && (
          <div className="payment-success-box">
            <div className="section-header">
              <h2>Payment Successful</h2>
              <span className="status-badge paid">paid</span>
            </div>

            <p>Your fake payment has been completed successfully.</p>
            <p>
              <strong>Booking status:</strong> paid
            </p>

            <button
              className="primary-button fake-pay-button"
              onClick={handleGoToConfirmation}
            >
              Go to Confirmation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;