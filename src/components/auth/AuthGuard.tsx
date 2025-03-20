import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If on auth page but already logged in, redirect to home
    if (!loading && isAuthenticated && location.pathname === "/auth") {
      navigate("/");
    }

    // If not logged in and not on auth page, redirect to auth page
    if (
      !loading &&
      !isAuthenticated &&
      !location.pathname.startsWith("/auth")
    ) {
      navigate("/auth");
    }
  }, [navigate, location.pathname, isAuthenticated, loading]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }

  // If not logged in and not on auth page, show loading while redirecting
  if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }

  // Otherwise, show the children
  return <>{children}</>;
}
