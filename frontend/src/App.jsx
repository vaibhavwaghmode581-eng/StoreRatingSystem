import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// ==========================================
// AUTH PAGES
// ==========================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// ==========================================
// DASHBOARDS
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminUsers from "./pages/AdminUsers";
import AdminAddUser from "./pages/AdminAddUser";
import UserDetails from "./pages/UserDetails";
import AdminStores from "./pages/AdminStores";
import AdminAddStore from "./pages/AdminAddStore";

// ==========================================
// COMMON PAGES
// ==========================================

import PasswordUpdate from "./pages/PasswordUpdate";

// ==========================================
// PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          {/* =====================================
              DEFAULT
          ===================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* =====================================
              LOGIN
          ===================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =====================================
              REGISTER
          ===================================== */}

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =====================================
              ADMIN DASHBOARD
          ===================================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              ADMIN USERS
          ===================================== */}

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              ADMIN ADD USER
          ===================================== */}

          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminAddUser />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              USER DETAILS
          ===================================== */}

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <UserDetails />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              ADMIN STORES
          ===================================== */}

          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminStores />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              ADMIN ADD STORE
          ===================================== */}

          <Route
            path="/admin/stores/add"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminAddStore />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              PASSWORD UPDATE
              ADMIN + USER + OWNER
          ===================================== */}

          <Route
            path="/password"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "USER",
                  "OWNER",
                ]}
              >
                <PasswordUpdate />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              NORMAL USER
          ===================================== */}

          <Route
            path="/user"
            element={
              <ProtectedRoute
                allowedRoles={["USER"]}
              >
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              STORE OWNER
          ===================================== */}

          <Route
            path="/owner"
            element={
              <ProtectedRoute
                allowedRoles={["OWNER"]}
              >
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* =====================================
              UNKNOWN URL
          ===================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;