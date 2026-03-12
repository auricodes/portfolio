import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <video className="landing-video" autoPlay loop muted playsInline>
        <source
          src="https://res.cloudinary.com/dixavtqng/video/upload/v1773261125/3125448-uhd_3840_2160_25fps_ry7yst.mp4"
          type="video/mp4"
        />
      </video>

      <div className="landing-overlay"></div>

      <div className="landing-content">
        <h1 className="landing-title">WELCOME ABOARD</h1>

        <button
          className="landing-button"
          onClick={() => navigate("/search")}
        >
          Book your next flight
        </button>
      </div>
    </div>
  );
}

export default LandingPage;