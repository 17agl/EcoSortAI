function EcoScore({ score = 0 }) {
  return (
    <div className="eco-score">

      <div className="eco-score-circle">

        <strong>
          {score}
        </strong>

        <span>
          /100
        </span>

      </div>

      <div>

        <h3>
          Eco Score
        </h3>

        <p>
          Environmental friendliness score
          based on the recycling recommendation.
        </p>

      </div>

    </div>
  );
}

export default EcoScore;