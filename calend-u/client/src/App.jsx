import { BrowserRouter, Routes, Route } from "react-router-dom";
import HostCalendar from "./pages/HostCalendar";
import GuestBooking from "./pages/GuestBooking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostCalendar />} />
        <Route path="/book/:hostId" element={<GuestBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
