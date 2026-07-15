import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("darshanease_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to refresh user", err);
      }
    }
  };

  const login = async (email, password) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem("darshanease_token", newToken);
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    return newUser;
  };

  const register = async (name, email, password, role, location) => {
    const response = await axios.post("/api/auth/register", { name, email, password, role, location });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem("darshanease_token", newToken);
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("darshanease_token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
