import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminAddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Frontend validation
    if (formData.name.trim().length < 20) {
      setError(
        "Name must be at least 20 characters"
      );
      return;
    }

    if (formData.name.trim().length > 60) {
      setError(
        "Name must not exceed 60 characters"
      );
      return;
    }

    if (formData.address.trim().length > 400) {
      setError(
        "Address must not exceed 400 characters"
      );
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 16
    ) {
      setError(
        "Password must be 8-16 characters"
      );
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter"
      );
      return;
    }

    if (
      !/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(
        formData.password
      )
    ) {
      setError(
        "Password must contain at least one special character"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/admin/users",
        formData
      );

      if (response.data.success) {
        setMessage(
          "User created successfully"
        );

        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "USER",
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="dashboard-header">

        <div>
          <h1>
            Add New User
          </h1>

          <p>
            Create a new user account
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/admin/users")
          }
        >
          Back to Users
        </button>

      </header>

      {/* ======================================
          FORM
      ====================================== */}

      <div className="form-card">

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />

            <small>
              20-60 characters
            </small>

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            <small>
              8-16 characters, uppercase and
              special character required
            </small>

          </div>

          {/* ADDRESS */}

          <div className="form-group">

            <label>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows="4"
              required
            />

            <small>
              Maximum 400 characters
            </small>

          </div>

          {/* ROLE */}

          <div className="form-group">

            <label>
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="USER">
                Normal User
              </option>

              <option value="ADMIN">
                Administrator
              </option>

              <option value="OWNER">
                Store Owner
              </option>

            </select>

          </div>

          {/* ERROR */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create User"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminAddUser;