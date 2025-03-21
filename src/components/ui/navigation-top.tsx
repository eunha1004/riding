import React from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "../auth/AuthContext";

interface NavigationTopProps {
  title: string;
  onBack?: () => void;
  showLogout?: boolean;
}

const NavigationTop = ({
  title,
  onBack,
  showLogout = false,
}: NavigationTopProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      // Fallback if auth context is not available
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-[56px] px-5 py-4 items-center justify-between self-stretch bg-white">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-0 h-6 w-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-base font-medium">{title}</h1>
      </div>
      {showLogout && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          로그아웃
        </Button>
      )}
    </div>
  );
};

export default NavigationTop;
