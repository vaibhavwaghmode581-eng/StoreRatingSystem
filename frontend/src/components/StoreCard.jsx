import { useState } from "react";
import api from "../services/api";

function StoreCard({ store, onRatingUpdated }) {
  const [rating, setRating] = useState(store.my_rating || 0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRating = async (value) => {
    const alreadyRated = rating > 0;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post("/ratings", {
        store_id: store.id,
        rating: value,
      });

      if (response.data.success) {
        setRating(value);

        if (alreadyRated) {
          setMessage("Rating updated successfully");
        } else {
          setMessage("Rating submitted successfully");
        }

        if (onRatingUpdated) {
          onRatingUpdated();
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit rating"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-card">

      <h3>{store.name}</h3>

      <p>
        <strong>Address:</strong>{" "}
        {store.address}
      </p>

      <p>
        <strong>Overall Rating:</strong>{" "}
        ⭐ {Number(store.average_rating || 0).toFixed(2)}
      </p>

      <p>
        <strong>Your Rating:</strong>{" "}
        {rating > 0
          ? `⭐ ${rating}`
          : "Not rated"}
      </p>

      <div className="rating-section">

        <p>
          <strong>
            {rating > 0
              ? "Modify your rating:"
              : "Submit your rating:"}
          </strong>
        </p>

        <div className="rating-buttons">

          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={
                rating === value
                  ? "rating-button selected"
                  : "rating-button"
              }
              onClick={() => handleRating(value)}
              disabled={loading}
            >
              ⭐ {value}
            </button>
          ))}

        </div>

      </div>

      {loading && (
        <p className="rating-loading">
          Saving rating...
        </p>
      )}

      {message && (
        <p className="rating-success">
          {message}
        </p>
      )}

      {error && (
        <p className="rating-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default StoreCard;