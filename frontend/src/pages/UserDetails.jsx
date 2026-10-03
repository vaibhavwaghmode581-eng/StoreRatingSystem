import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/admin/users/${id}`
        );

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error(
          "USER DETAILS ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to fetch user details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="user-details-page">
        <div className="details-card">
          <h2>Loading user details...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="user-details-page">

        <div className="details-card">

          <div className="error-message">
            {error}
          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            Back to Users
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // USER NOT FOUND
  // ==========================================

  if (!user) {
    return (
      <div className="user-details-page">

        <div className="details-card">

          <h2>User not found</h2>

          <button
            className="back-button"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            Back to Users
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // STORE INFORMATION
  // ==========================================

  const store =
    user.store ||
    user.store_details ||
    user.storeDetails ||
    null;

  return (
    <div className="user-details-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="details-header">

        <div>
          <h1>User Details</h1>

          <p>
            Administrator user information
          </p>
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/admin/users")
          }
        >
          Back to Users
        </button>

      </div>

      {/* ======================================
          PERSONAL INFORMATION
      ====================================== */}

      <div className="details-card">

        <h2>
          Personal Information
        </h2>

        <div className="detail-row">

          <span className="detail-label">
            Name
          </span>

          <span className="detail-value">
            {user.name}
          </span>

        </div>

        <div className="detail-row">

          <span className="detail-label">
            Email
          </span>

          <span className="detail-value">
            {user.email}
          </span>

        </div>

        <div className="detail-row">

          <span className="detail-label">
            Address
          </span>

          <span className="detail-value">
            {user.address}
          </span>

        </div>

        <div className="detail-row">

          <span className="detail-label">
            Role
          </span>

          <span
            className={`role-badge ${String(
              user.role
            ).toLowerCase()}`}
          >
            {user.role}
          </span>

        </div>

      </div>

      {/* ======================================
          STORE OWNER INFORMATION
      ====================================== */}

      {user.role === "OWNER" && store && (

        <div className="details-card">

          <h2>
            Store Information
          </h2>

          <div className="detail-row">

            <span className="detail-label">
              Store Name
            </span>

            <span className="detail-value">
              {store.name}
            </span>

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Store Email
            </span>

            <span className="detail-value">
              {store.email}
            </span>

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Store Address
            </span>

            <span className="detail-value">
              {store.address}
            </span>

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Average Rating
            </span>

            <span className="rating-value">
              ⭐{" "}
              {Number(
                store.average_rating || 0
              ).toFixed(2)}
            </span>

          </div>

          <div className="detail-row">

            <span className="detail-label">
              Total Ratings
            </span>

            <span className="detail-value">
              {store.total_ratings || 0}
            </span>

          </div>

        </div>

      )}

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <div className="bottom-actions">

        <button
          className="back-button"
          onClick={() =>
            navigate("/admin/users")
          }
        >
          ← Back to Users
        </button>

      </div>

    </div>
  );
}

export default UserDetails;