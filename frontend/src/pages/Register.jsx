import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Required fields
    if (
      !name ||
      !email ||
      !address ||
      !password
    ) {
      setError(
        "All fields are required"
      );
      return;
    }

    // Name validation
    if (
      name.trim().length < 20 ||
      name.trim().length > 60
    ) {
      setError(
        "Name must be between 20 and 60 characters"
      );
      return;
    }

    // Address validation
    if (address.trim().length > 400) {
      setError(
        "Address must not exceed 400 characters"
      );
      return;
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(
        "Please enter a valid email address"
      );
      return;
    }

    // Password validation
    if (
      password.length < 8 ||
      password.length > 16
    ) {
      setError(
        "Password must be 8-16 characters"
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter"
      );
      return;
    }

    if (
      !/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(
        password
      )
    ) {
      setError(
        "Password must contain at least one special character"
      );
      return;
    }

    setLoading(true);

    const result = await register(
      name,
      email,
      address,
      password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(
      "Registration successful! Redirecting to login..."
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Store Rating System</h1>

        <h2>Create Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <small>
              20-60 characters
            </small>
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* ADDRESS */}
          <div className="form-group">
            <label>Address</label>

            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              rows="4"
            />

            <small>
              Maximum 400 characters
            </small>
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <small>
              8-16 characters, uppercase and
              special character required
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;