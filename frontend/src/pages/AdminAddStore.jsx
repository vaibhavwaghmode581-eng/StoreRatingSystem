import { useState } from "react";
import api from "../services/api";

function AdminAddStore() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [loading, setLoading] = useState(false);
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
      setLoading(true);

      const response = await api.post("/admin/stores", {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        owner_id: formData.owner_id
          ? Number(formData.owner_id)
          : null,
      });

      if (response.data.success) {
        setMessage("Store created successfully!");

        setFormData({
          name: "",
          email: "",
          address: "",
          owner_id: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create store"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">

        <div>
          <h1>Add Store</h1>
          <p>Admin Store Management</p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => {
            window.location.href = "/admin/stores";
          }}
        >
          ← Back to Stores
        </button>

      </div>

      {/* Store Form */}
      <div className="store-form">

        <h2>Store Information</h2>

        <p className="form-description">
          Enter the details of the store below.
        </p>

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

          {/* Store Name */}
          <div className="form-group">

            <label>Store Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter store name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Store Email */}
          <div className="form-group">

            <label>Store Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter store email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Store Address */}
          <div className="form-group">

            <label>Store Address</label>

            <textarea
              name="address"
              placeholder="Enter store address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="4"
            />

          </div>

          {/* Owner ID */}
          <div className="form-group">

            <label>Owner ID</label>

            <input
              type="number"
              name="owner_id"
              placeholder="Enter Store Owner ID"
              value={formData.owner_id}
              onChange={handleChange}
            />

            <small>
              Leave empty if no owner is assigned.
            </small>

          </div>

          {/* Buttons */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                window.location.href = "/admin/stores";
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Store"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AdminAddStore;