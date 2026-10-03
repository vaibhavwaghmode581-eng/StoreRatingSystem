import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PasswordUpdate() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      setError("Password must be 8 to 16 characters long");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError("Password must contain at least one special character");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div>
          <h1>Update Password</h1>
          <p>Change your account password</p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </header>

      <div className="password-page">

        <h2>Password Information</h2>

        <p className="password-description">
          Update your password to keep your account secure.
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

          <div className="form-group">
            <label>Current Password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
            />
          </div>

          <div className="password-hint">
            <strong>Password requirements</strong>

            <ul>
              <li>8–16 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one special character</li>
            </ul>
          </div>

          <div className="password-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-button"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default PasswordUpdate;