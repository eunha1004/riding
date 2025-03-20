import React from "react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface NavigationMenuProps {
  userName?: string;
  onLogout?: () => void;
}

const NavigationMenu = ({
  userName = "사용자",
  onLogout,
}: NavigationMenuProps) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    // If onLogout prop is provided, call it
    if (onLogout) {
      onLogout();
    } else if (auth && auth.logout) {
      // Use AuthContext logout if available
      auth.logout();
    } else {
      // Default logout behavior - clear any auth data from localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");

      // Navigate to login page
      navigate("/auth");
    }
  };

  return (
    <nav className="bg-white shadow-sm py-2 px-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-primary font-bold text-lg">대치라이드</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-1" />
            <span>{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-3 w-3 mr-1" />
            로그아웃
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
