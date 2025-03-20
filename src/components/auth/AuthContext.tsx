import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string;
  provider: "kakao" | "phone" | "email";
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Standalone logout function
export const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userData");
  localStorage.removeItem("kakaoToken");
  localStorage.removeItem("authToken");

  // Redirect to login page
  window.location.href = "/auth";
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const kakaoToken = localStorage.getItem("kakaoToken");
    const userData = localStorage.getItem("userData");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if ((kakaoToken || isLoggedIn === "true") && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("kakaoToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("isLoggedIn");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: User) => {
    // Store user data and auth state
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");

    // If it's a Kakao login, we would store the Kakao token here
    if (userData.provider === "kakao" && userData.kakaoToken) {
      localStorage.setItem("kakaoToken", userData.kakaoToken);
    }

    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    // If user logged in with Kakao, we should also revoke the Kakao token
    // In a real app, you would call your backend to handle this
    if (user?.provider === "kakao") {
      try {
        // This would be handled by your backend in a real app
        console.log("Revoking Kakao token");
      } catch (error) {
        console.error("Error revoking Kakao token:", error);
      }
    }

    // Clear all auth-related data
    localStorage.removeItem("kakaoToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");

    setIsAuthenticated(false);
    setUser(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
