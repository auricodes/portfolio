import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import FlightDetailsPage from "./pages/FlightDetailsPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";

function AppContent() {
  const location = useLocation();
  const pathname = location.pathname;

  const flightVideoMap = {
    FL001:
      "https://res.cloudinary.com/dixavtqng/video/upload/v1773264127/london_e2ou3i.mp4",
    FL002:
      "https://res.cloudinary.com/dixavtqng/video/upload/v1773263117/paris_at0ktt.mp4",
    FL003:
      "https://res.cloudinary.com/dixavtqng/video/upload/v1773263109/barcelona_iin8ew.mp4",
    FL004:
      "https://res.cloudinary.com/dixavtqng/video/upload/v1773264039/berlino_lwiaaw.mp4",
    FL005:
      "https://res.cloudinary.com/dixavtqng/video/upload/v1773302190/newyork_wvxohp.mp4",
    FL006:
      "https://res.cloudinary.com/dixavtqng/video/upload/v1773074182/amsterdam_a0r2kv.mp4",
  };

  const defaultSiteVideo =
    "https://res.cloudinary.com/dixavtqng/video/upload/v1773264044/flight-bg_kir0p6.mp4";

  const getFlightIdFromPath = () => {
    const parts = pathname.split("/");
    return parts[2] || null;
  };

  const getBackgroundVideo = () => {
    if (pathname === "/") {
      return null;
    }

    if (pathname === "/search" || pathname === "/confirmation") {
      return defaultSiteVideo;
    }

    if (
      pathname.startsWith("/flights/") ||
      pathname.startsWith("/booking/") ||
      pathname.startsWith("/seat-selection/")
    ) {
      const flightId = getFlightIdFromPath();
      return flightVideoMap[flightId] || defaultSiteVideo;
    }

    return defaultSiteVideo;
  };

  const backgroundVideo = getBackgroundVideo();

  return (
    <>
      {backgroundVideo && (
        <div className="site-video-bg">
          <video autoPlay loop muted playsInline key={backgroundVideo}>
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="site-video-overlay"></div>
        </div>
      )}

      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<HomePage />} />
          <Route path="/flights/:id" element={<FlightDetailsPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/seat-selection/:id" element={<SeatSelectionPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;