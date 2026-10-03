import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch owner dashboard
  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/owner/dashboard");

      if (response.data.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      console.error("OWNER DASHBOARD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load owner dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Loading
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="card">
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="card">

          <div className="error-message">
            {error}
          </div>

          <button
            className="primary-button"
            onClick={fetchOwnerDashboard}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <h1>Store Owner Dashboard</h1>

          <p>
            Welcome, {user?.name || "Store Owner"}
          </p>
        </div>

        <div className="header-actions">

          <button
            className="secondary-button"
            onClick={() => navigate("/password")}
          >
            Update Password
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* Stores */}
      {dashboard?.stores?.length === 0 ? (

        <div className="card">
          <h2>No Store Found</h2>

          <p>
            No store has been assigned to your account yet.
          </p>
        </div>

      ) : (

        dashboard?.stores?.map((store) => (

          <div
            className="card"
            key={store.id}
          >

            {/* Store Information */}
            <div className="section-header">

              <div>
                <h2>{store.name}</h2>

                <p>
                  <strong>Email:</strong>{" "}
                  {store.email || "N/A"}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {store.address}
                </p>
              </div>

            </div>

            {/* Statistics */}
            <div className="stats-grid">

              <div className="stat-card">

                <h3>Average Rating</h3>

                <p>
                  ⭐{" "}
                  {Number(
                    store.average_rating || 0
                  ).toFixed(2)}
                </p>

              </div>

              <div className="stat-card">

                <h3>Total Ratings</h3>

                <p>
                  {store.total_ratings || 0}
                </p>

              </div>

            </div>

            {/* Rated Users */}
            <div className="card">

              <div className="section-header">

                <h2>
                  Users Who Rated Your Store
                </h2>

                <span>
                  {store.rated_users?.length || 0} user
                  {store.rated_users?.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>

              {store.rated_users &&
              store.rated_users.length > 0 ? (

                <div className="table-container">

                  <table>

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>

                      {store.rated_users.map(
                        (ratedUser) => (

                          <tr
                            key={`${ratedUser.user_id}-${ratedUser.created_at}`}
                          >

                            <td>
                              {ratedUser.user_name}
                            </td>

                            <td>
                              {ratedUser.user_email}
                            </td>

                            <td>
                              ⭐ {ratedUser.rating}
                            </td>

                            <td>
                              {new Date(
                                ratedUser.created_at
                              ).toLocaleDateString()}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <p>
                  No users have rated this store yet.
                </p>

              )}

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default OwnerDashboard;