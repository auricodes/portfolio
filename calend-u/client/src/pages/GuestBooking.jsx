import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function GuestBooking() {
  const { hostId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const slot = location.state?.slot || null;

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!slot) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.h2}>Slot non valido</h2>
          <p style={styles.p}>
            Torna al calendario e seleziona prima una data e uno slot.
          </p>
          <button style={styles.secondaryBtn} onClick={() => navigate("/")}>
            Torna al calendario
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMsg("");

      await API.post(`/bookings/hosts/${hostId}/slot`, {
        guestName,
        guestEmail,
        start: slot.start,
        end: slot.end,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Errore durante la prenotazione. Riprova tra poco.");
    } finally {
      setLoading(false);
    }
  };

if (success) {
  const startDate = new Date(slot.start);

  const formattedDate = startDate.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.h2}>Prenotazione confermata 🎉</h2>

        <div style={styles.slotBox}>
          <div style={styles.dateText}>
            {formattedDate}
          </div>

          <div>
            {new Date(slot.start).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" - "}
            {new Date(slot.end).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <button style={styles.primaryBtn} onClick={() => navigate("/")}>
          Torna al calendario
        </button>
      </div>
    </div>
  );
}

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.h2}>Completa la prenotazione</h2>

        <div style={styles.slotBox}>
          {new Date(slot.start).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(slot.end).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nome e Cognome"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
          />

          <button style={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Prenotazione..." : "Prenota"}
          </button>

          {errorMsg && <div style={styles.errorText}>{errorMsg}</div>}
        </form>

        <button style={styles.secondaryBtn} onClick={() => navigate("/")}>
          Indietro
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center", //centra verticalmente
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    border: "1px solid #e5e5e5",
    borderRadius: 16,
    padding: 20,
    background: "white",
  },
  h2: {
    margin: "0 0 14px",
    textAlign: "center",
  },
  p: {
    margin: "0 0 14px",
    color: "#555",
    textAlign: "center",
    lineHeight: 1.4,
  },
  slotBox: {
    margin: "0 auto 16px",
    padding: "14px 14px",
    border: "1px solid #ddd",
    borderRadius: 12,
    fontWeight: 800,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12, //angoli arrotondati
    border: "1px solid #ddd",
    fontSize: 16,
    outline: "none",
  },
  primaryBtn: {
    marginTop: 2,
    padding: "12px",
    width: "100%",
    borderRadius: 12,
    border: "none",
    background: "#111",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryBtn: {
    marginTop: 12,
    padding: "12px",
    width: "100%",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  errorText: {
    color: "#b00020",
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 4,
  },
  dateText: {
  fontWeight: 700,
  marginBottom: 6,
  textTransform: "capitalize",
},
};