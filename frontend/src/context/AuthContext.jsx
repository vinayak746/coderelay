import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);

const TOKEN_KEY = "coderelay_token";
const USER_KEY = "coderelay_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };
  useEffect(() => {
    const savedToken =
      localStorage.getItem(TOKEN_KEY) ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTgxY2IzNzdjYzRkMGZhODdkMDI0YyIsInJvbGUiOiJlbXBsb3llZSIsImlhdCI6MTc3MTU4MjQ3MCwiZXhwIjoxNzcyMTg3MjcwfQ.qy2IyKgzihsB_CGwRmxqnBOHWB2qohBfJVr7PAl-aPE";
    console.log(savedToken);
    if (savedToken) {
      try {
        setToken(savedToken);
        api.get("http://localhost:3000/api/auth/me").then(({ user }) => {
          login(user, token);
        });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isManager = user?.role === "manager";

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isManager,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
