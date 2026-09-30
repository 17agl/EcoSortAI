import ConfidenceBar from "./ConfidenceBar";
import EcoScore from "./EcoScore";

function ResultCard({
  objectName = "Waiting for AI",
  material = "Not analyzed",
  recommendation = "Upload an image to begin",
  confidence = 0,
  ecoScore = 0,
}) {
  return (
    <div className="result-card">

      <div className="result-header">

        <div>

          <span className="result-label">
            AI ANALYSIS
          </span>

          <h2>
            {objectName}
          </h2>

        </div>

        <div className="material-badge">
          {material}
        </div>

      </div>

      <ConfidenceBar
        confidence={confidence}
      />

      <div className="recommendation">

        <span className="recommendation-icon">
          ♻️
        </span>

        <div>

          <span>
            Recommendation
          </span>

          <h3>
            {recommendation}
          </h3>

        </div>

      </div>

      <EcoScore
        score={ecoScore}
      />

    </div>
  );
}

export default ResultCard;