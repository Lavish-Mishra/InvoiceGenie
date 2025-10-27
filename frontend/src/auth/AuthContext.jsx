// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount → try to load user profile if token exists
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (access) {
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      api
        .get("/users/profile/")
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ access, refresh }) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    try {
      const res = await api.get("/users/profile/");
      setUser(res.data);
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    api.defaults.headers.common["Authorization"] = "";
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
