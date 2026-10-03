import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminAddStore() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Access token required. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/stores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            address: formData.address,
            owner_id: formData.owner_id
              ? Number(formData.owner_id)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create store");
        return;
      }

      setMessage("Store created successfully!");

      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });

      setTimeout(() => {
        navigate("/admin/stores");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Add Store</h1>
          <p>Admin Store Management</p>
        </div>

        <button
          className="btn"
          onClick={() => navigate("/admin/stores")}
        >
          Back to Stores
        </button>
      </div>

      <div className="form-card">

        <h2>Store Information</h2>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Store Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter store name"
              required
            />
          </div>

          <div className="form-group">
            <label>Store Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter store email"
              required
            />
          </div>

          <div className="form-group">
            <label>Store Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter store address"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Owner ID</label>

            <input
              type="number"
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              placeholder="Enter Store Owner ID"
            />

            <small>
              Leave empty if no owner is assigned.
            </small>
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate("/admin/stores")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn"
            >
              Create Store
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AdminAddStore;