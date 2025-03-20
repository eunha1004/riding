import React from "react";
import { Home, Calendar, User, Clock } from "lucide-react";

interface GNBProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
}

const GNB = ({
  activeSection = "overview",
  onChangeSection = () => {},
}: GNBProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-[390px] mx-auto flex justify-between items-center px-2 py-2">
        <button
          onClick={() => onChangeSection("overview")}
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${activeSection === "overview" ? "text-primary" : "text-gray-500"}`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">홈</span>
        </button>
        <button
          onClick={() => onChangeSection("schedule")}
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${activeSection === "schedule" ? "text-primary" : "text-gray-500"}`}
        >
          <Calendar className="h-5 w-5 mb-1" />
          <span className="text-xs">일정 예약</span>
        </button>
        <button
          onClick={() => onChangeSection("profile")}
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${activeSection === "profile" ? "text-primary" : "text-gray-500"}`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">내 정보</span>
        </button>
        <button
          onClick={() => onChangeSection("history")}
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${activeSection === "history" ? "text-primary" : "text-gray-500"}`}
        >
          <Clock className="h-5 w-5 mb-1" />
          <span className="text-xs">이용내역</span>
        </button>
      </div>
    </div>
  );
};

export default GNB;
