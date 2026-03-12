import { useEffect, useMemo, useState } from "react";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import { getAllFlights, searchFlights } from "../services/flightService";

function HomePage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const loadAllFlights = async () => {
    try {
      setLoading(true);
      setMessage("");
      const data = await getAllFlights();
      setFlights(data);
    } catch (error) {
      console.error("Error loading flights:", error);
      setMessage("Failed to load flights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllFlights();
  }, []);

  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      setMessage("");

      const cleanedData = {
        from: searchData.from || undefined,
        to: searchData.to || undefined,
        date: searchData.date || undefined,
      };

      const data = await searchFlights(cleanedData);
      setFlights(data);
      setSortBy("default");

      if (data.length === 0) {
        setMessage("No flights found for your search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSortBy("default");
    await loadAllFlights();
  };

  const sortedFlights = useMemo(() => {
    const copiedFlights = [...flights];

    if (sortBy === "price-asc") {
      return copiedFlights.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return copiedFlights.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "departure-asc") {
      return copiedFlights.sort(
        (a, b) => new Date(a.departureTime) - new Date(b.departureTime)
      );
    }

    return copiedFlights;
  }, [flights, sortBy]);

  return (
    <div className="home-page">
      <h1>Booking Flights</h1>
      <p className="subtitle">Search and book your next flight.</p>

      <SearchForm onSearch={handleSearch} onReset={handleReset} />

      <div className="results-section">
        <div className="results-header">
          <h2>Available Flights</h2>

          <div className="sort-box">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="departure-asc">Departure time</option>
            </select>
          </div>
        </div>

        {loading && <p>Loading flights...</p>}

        {!loading && !message && (
          <p className="results-count">
            {sortedFlights.length} flight{sortedFlights.length !== 1 ? "s" : ""} found
          </p>
        )}

        {message && <p>{message}</p>}

        {!loading && sortedFlights.length > 0 && (
          <div className="flights-grid">
            {sortedFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;