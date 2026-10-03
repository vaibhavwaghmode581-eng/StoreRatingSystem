import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  // ============================
  // LOGIN
  // ============================
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const loggedInUser = response.data.user;
        const loggedInToken = response.data.token;

        localStorage.setItem(
          "token",
          loggedInToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        setToken(loggedInToken);
        setUser(loggedInUser);

        return {
          success: true,
          user: loggedInUser,
        };
      }

      return {
        success: false,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // ============================
  // REGISTER
  // ============================
  const register = async (
    name,
    email,
    address,
    password
  ) => {
    try {
      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          address,
          password,
        }
      );

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ============================
  // AUTH STATUS
  // ============================
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================
// CUSTOM HOOK
// ============================
export const useAuth = () => {
  return useContext(AuthContext);
};