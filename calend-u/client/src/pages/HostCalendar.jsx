import { useEffect, useMemo, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom"; 

// ---- helpers date ----
function pad2(n) {
  return String(n).padStart(2, "0");
}

function toYYYYMMDD(dateObj) {
  const y = dateObj.getFullYear();
  const m = pad2(dateObj.getMonth() + 1);
  const d = pad2(dateObj.getDate());
  return `${y}-${m}-${d}`;
}

function mondayIndex(jsGetDay) {
  return (jsGetDay + 6) % 7;
}

function buildMonthMatrix(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const startOffset = mondayIndex(first.getDay());
  const totalCells = startOffset + daysInMonth;
  const weeks = Math.ceil(totalCells / 7);

  const matrix = [];
  let day = 1;

  for (let w = 0; w < weeks; w++) {
    const row = [];
    for (let c = 0; c < 7; c++) {
      const cellIndex = w * 7 + c;
      if (cellIndex < startOffset || day > daysInMonth) {
        row.push(null);
      } else {
        row.push(new Date(year, monthIndex, day));
        day++;
      }
    }
    matrix.push(row);
  }
  return matrix;
}

export default function HostCalendar() {
  const navigate = useNavigate();
  const hostId = "69a1c333908971aa89953b07";

  const [year, setYear] = useState(2026);
  const [monthIndex, setMonthIndex] = useState(2);
  const [dateStr, setDateStr] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const monthMatrix = useMemo(
    () => buildMonthMatrix(year, monthIndex),
    [year, monthIndex]
  );

  const monthLabel = useMemo(() => {
    const d = new Date(year, monthIndex, 1);
    return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  }, [year, monthIndex]);

  const isValidYYYYMMDD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

  const fetchSlots = async (selectedDateStr) => {
    if (!isValidYYYYMMDD(selectedDateStr)) return;

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await API.get("/availability/slots", {
        params: { hostId, date: selectedDateStr },
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setSlots([]);
      setErrorMsg("Errore nel caricamento slot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedSlot(null);

    if (isValidYYYYMMDD(dateStr)) {
      fetchSlots(dateStr);
    } else {
      setSlots([]);
      setErrorMsg("");
    }
  }, [dateStr]);

  const onClickDay = (dateObj) => {
    setDateStr(toYYYYMMDD(dateObj));
  };

  const goPrevMonth = () => {
    const d = new Date(year, monthIndex - 1, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
    setDateStr("");
  };

  const goNextMonth = () => {
    const d = new Date(year, monthIndex + 1, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
    setDateStr("");
  };

  const weekDays = ["L", "M", "M", "G", "V", "S", "D"];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Prenota una call di 30 minuti</h1>

      <div style={styles.centerWrap}>
        <div style={styles.container}>
          {/* LEFT */}
          <div style={styles.left}>
            <div style={styles.monthHeader}>
              <button style={styles.navBtn} onClick={goPrevMonth} type="button">
                ◀
              </button>
              <div style={styles.monthLabel}>{monthLabel}</div>
              <button style={styles.navBtn} onClick={goNextMonth} type="button">
                ▶
              </button>
            </div>

            <div style={styles.calendarGrid}>
              {weekDays.map((d) => (
                <div key={d} style={styles.weekDayCell}>
                  {d}
                </div>
              ))}

              {monthMatrix.flat().map((cell, idx) => {
                if (!cell) return <div key={idx} style={styles.dayCellEmpty} />;

                const cellStr = toYYYYMMDD(cell);
                const isSelected = cellStr === dateStr;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onClickDay(cell)}
                    style={{
                      ...styles.dayCell,
                      ...(isSelected ? styles.dayCellSelected : {}),
                    }}
                  >
                    {cell.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.right}>
            <label style={styles.label}>Inserisci data</label>

            <input
              style={styles.searchInput}
              placeholder="YYYY-MM-DD"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />

            {selectedSlot && (
              <div style={styles.infoText}>
                Slot selezionato:{" "}
                <strong>
                  {new Date(selectedSlot.start).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(selectedSlot.end).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </div>
            )}
            {selectedSlot && (
                <button
                    style={styles.confirmButton}
                    onClick={() =>
                        navigate(`/book/${hostId}`, {
                            state: {
                                slot: selectedSlot,
                                date: dateStr,
                            },
                        })
                    }
                >
                    Continua
                </button>
            )}

            <div style={{ marginTop: 16 }}>
              {loading && <div style={styles.infoText}>Caricamento slot…</div>}

              {!loading && errorMsg && (
                <div style={styles.errorText}>{errorMsg}</div>
              )}

              {!loading &&
                isValidYYYYMMDD(dateStr) &&
                !errorMsg &&
                slots.length === 0 && (
                  <div style={styles.infoText}>
                    Nessuno slot disponibile per questa data.
                  </div>
                )}

              {!loading && slots.length > 0 && (
                <div style={styles.slotList}>
                  {slots.map((slot, i) => {
                    const isSelected =
                      selectedSlot &&
                      selectedSlot.start === slot.start &&
                      selectedSlot.end === slot.end;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          ...styles.slotItem,
                          ...(isSelected ? styles.slotItemSelected : {}),
                        }}
                      >
                        {new Date(slot.start).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(slot.end).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  title: {
    width: "100%",
    textAlign: "center",
    margin: "0 0 24px",
    letterSpacing: "0.5px",
  },
  centerWrap: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "500px 500px",
    gap: 40,
    alignItems: "start",
  },
  left: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 16,
  },
  right: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 16,
  },
  monthHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthLabel: {
    fontWeight: 700,
    textTransform: "capitalize",
  },
  navBtn: {
    border: "1px solid #ddd",
    background: "white",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 8,
  },
  weekDayCell: {
    textAlign: "center",
    fontWeight: 700,
    padding: "6px 0",
    borderRadius: 8,
    background: "#f6f6f6",
  },
  dayCellEmpty: {
    height: 44,
  },
  dayCell: {
    height: 44,
    borderRadius: 10,
    border: "1px solid #e1e1e1",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  dayCellSelected: {
    border: "2px solid #111",
  },
  label: {
    display: "block",
    fontWeight: 700,
    marginBottom: 8,
  },
  searchInput: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    fontSize: 16,
    outline: "none",
  },
  infoText: {
    color: "#555",
    padding: "10px 0",
  },
  errorText: {
    color: "#b00020",
    padding: "10px 0",
    fontWeight: 600,
  },
  slotList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  slotItem: {
    width: "100%",
    textAlign: "left",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 700,
    background: "white",
    cursor: "pointer",
  },
  slotItemSelected: {
    border: "2px solid #111",
  },
  confirmButton: {
  marginTop: 12,
  padding: "12px",
  width: "100%",
  borderRadius: 12,
  border: "none",
  background: "#111",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
},
};