import { useNavigate } from "react-router-dom";

function ScanCard() {
  const navigate = useNavigate();

  return (
    <div className="scan-card">

      <div className="scan-card-content">

        <div className="scan-icon">
          ♻️
        </div>

        <div>

          <h2>
            Scan Your Waste
          </h2>

          <p>
            Upload a photo of any waste item
            and let EcoSort AI analyze its
            material and recycling possibilities.
          </p>

          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              navigate("/scan");
            }}
          >
            Start Scanning →
          </button>

        </div>

      </div>

      <div className="scan-decoration">
        🌱
      </div>

    </div>
  );
}

export default ScanCard;