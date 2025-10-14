import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Set the token in the API client
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user data
          const response = await api.get("/auth/me");
          // backend returns { success: true, data: user }
          const userData = response.data?.data || response.data?.user || null;
          setUser(userData);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      // backend login route is '/auth/login'
      const response = await api.post("/auth/login", { email, password });
      const token = response.data?.token || response.data?.data?.token;
      const user = response.data?.user || response.data?.data || null;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to sign in",
      };
    }
  };

  const signUp = async (userData) => {
    try {
      await api.post("/auth/signup", userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create account",
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/signin");
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
