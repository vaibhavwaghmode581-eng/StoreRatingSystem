import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        sortBy,
        order,
      };

      if (name.trim()) {
        params.name = name.trim();
      }

      if (email.trim()) {
        params.email = email.trim();
      }

      if (address.trim()) {
        params.address = address.trim();
      }

      if (role) {
        params.role = role;
      }

      const response = await api.get("/admin/users", {
        params,
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  const handleApplyFilter = () => {
    fetchUsers();
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setAddress("");
    setRole("");
    setSortBy("name");
    setOrder("asc");

    setTimeout(() => {
      fetchUsers();
    }, 0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return "↕";
    }

    return order === "asc" ? "↑" : "↓";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Loading users...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p>Admin User Management</p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            onClick={() => navigate("/admin")}
          >
            Dashboard
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

      <div className="card">
        <h2>Search / Filter Users</h2>

        <div className="filter-grid">

          <input
            type="text"
            placeholder="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="USER">Normal User</option>
            <option value="ADMIN">Administrator</option>
            <option value="OWNER">Store Owner</option>
          </select>

        </div>

        <div className="button-row">
          <button
            className="primary-button"
            onClick={handleApplyFilter}
          >
            Apply Filter
          </button>

          <button
            className="secondary-button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="card">

        <div className="section-header">
          <h2>Users ({users.length})</h2>

          <button
            className="primary-button"
            onClick={() => navigate("/admin/users/add")}
          >
            + Add User
          </button>
        </div>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="table-container">
            <table>

              <thead>
                <tr>

                  <th>ID</th>

                  <th
                    className="sortable"
                    onClick={() => handleSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </th>

                  <th
                    className="sortable"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </th>

                  <th
                    className="sortable"
                    onClick={() => handleSort("address")}
                  >
                    Address {getSortIcon("address")}
                  </th>

                  <th
                    className="sortable"
                    onClick={() => handleSort("role")}
                  >
                    Role {getSortIcon("role")}
                  </th>

                  <th>Action</th>

                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>{user.address}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <button
                        className="secondary-button"
                        onClick={() =>
                          navigate(`/admin/users/${user.id}`)
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminUsers;