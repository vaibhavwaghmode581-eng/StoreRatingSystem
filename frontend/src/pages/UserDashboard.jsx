import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StoreCard from "../components/StoreCard";

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch stores
  const fetchStores = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/stores", {
        params: {
          search: searchValue,
        },
      });

      if (response.data.success) {
        setStores(response.data.stores || []);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load stores"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Search stores
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    fetchStores(value);
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <h1>User Dashboard</h1>

          <p>
            Welcome, {user?.name}
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

      {/* Search */}
      <div className="card search-section">

        <h2>Find a Store</h2>

        <p>
          Search stores by name or address
        </p>

        <input
          type="text"
          placeholder="Search store by name or address..."
          value={search}
          onChange={handleSearch}
        />

      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Stores */}
      <div className="card">

        <div className="section-header">
          <h2>Available Stores</h2>

          {!loading && (
            <span>
              {stores.length} store
              {stores.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <p>Loading stores...</p>
        ) : stores.length === 0 ? (
          <p>No stores found.</p>
        ) : (
          <div className="stores-grid">

            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRatingUpdated={() =>
                  fetchStores(search)
                }
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default UserDashboard;