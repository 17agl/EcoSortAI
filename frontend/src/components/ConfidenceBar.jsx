function ConfidenceBar({ confidence = 0 }) {
  return (
    <div className="confidence-container">

      <div className="confidence-header">

        <span>
          AI Confidence
        </span>

        <strong>
          {confidence}%
        </strong>

      </div>

      <div className="confidence-track">

        <div
          className="confidence-fill"
          style={{
            width: `${confidence}%`,
          }}
        ></div>

      </div>

    </div>
  );
}

export default ConfidenceBar;