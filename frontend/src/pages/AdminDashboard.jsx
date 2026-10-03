import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            onClick={() => navigate("/admin/users")}
          >
            Users
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/admin/stores")}
          >
            Stores
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.total_users}</p>
            </div>

            <div className="stat-card">
              <h3>Total Stores</h3>
              <p>{stats.total_stores}</p>
            </div>

            <div className="stat-card">
              <h3>Total Ratings</h3>
              <p>{stats.total_ratings}</p>
            </div>

          </div>

          <div className="card">

            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="button-row">

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/admin/users")
                }
              >
                Manage Users
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/admin/stores")
                }
              >
                Manage Stores
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  navigate("/password")
                }
              >
                Update Password
              </button>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default AdminDashboard;