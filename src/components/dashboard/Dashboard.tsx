import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import { User, Car, BarChart, Calendar, Clock, MapPin } from "lucide-react";
import GNB from "../ui/gnb";
import NavigationMenu from "./NavigationMenu";
import BookingFlow from "../booking/BookingFlow";
import ProfileManager from "../profile/ProfileManager";
import PaymentFlow from "../payment/PaymentFlow";
import RideDetails from "../rides/RideDetails";
import { useAuth } from "../auth/AuthContext";

interface DashboardProps {
  userName?: string;
  onLogout?: () => void;
}

const Dashboard = ({ userName = "김지연", onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const { logout } = useAuth();

  // 대시보드용 샘플 데이터
  const upcomingRides = [
    {
      id: "ride1",
      date: "2023-06-15",
      time: "오전 7:30",
      dropoffTime: "오전 8:15",
      from: "집",
      to: "학교",
      status: "scheduled",
      isRecurring: false,
    },
    {
      id: "ride2",
      date: "2023-06-15",
      time: "오후 3:30",
      dropoffTime: "오후 4:10",
      from: "학교",
      to: "집",
      status: "scheduled",
      isRecurring: false,
    },
    {
      id: "ride3",
      date: "2023-06-16",
      time: "오전 7:30",
      dropoffTime: "오전 8:15",
      from: "집",
      to: "학교",
      status: "scheduled",
      isRecurring: true,
      recurringDays: "월, 수, 금",
    },
  ];

  const recentRides = [
    {
      id: "past1",
      date: "2023-06-14",
      time: "오후 3:30",
      dropoffTime: "오후 4:10",
      from: "학교",
      to: "집",
      status: "completed",
      isRecurring: false,
    },
    {
      id: "past2",
      date: "2023-06-14",
      time: "오전 7:30",
      dropoffTime: "오전 8:15",
      from: "집",
      to: "학교",
      status: "completed",
      isRecurring: false,
    },
  ];

  const savedLocations = [
    { id: "loc1", name: "집", address: "서울시 강남구 테헤란로 123" },
    { id: "loc2", name: "학교", address: "서울시 강남구 선릉로 456" },
    {
      id: "loc3",
      name: "축구교실",
      address: "서울시 강남구 영동대로 789",
    },
    {
      id: "loc4",
      name: "할머니 집",
      address: "서울시 서초구 서초대로 321",
    },
  ];

  // 현재 활성화된 섹션에 따라 제목 설정
  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return "대시보드";
      case "schedule":
        return "일정 예약";
      case "profile":
        return "내 정보";
      case "history":
        return "이용내역";
      case "recharge":
        return "이용권 충전";
      case "rideDetails":
        return "이동 상세 정보";
      default:
        return "대시보드";
    }
  };

  const showRideDetails = (ride) => {
    setSelectedRide(ride);
    setActiveSection("rideDetails");
  };

  const handleCancelRide = (ride) => {
    // 여기에 실제 취소 로직 추가
    console.log("Ride cancelled:", ride.id);

    // 취소 후 목록으로 돌아가기
    setSelectedRide(null);
    setActiveSection("overview");
  };

  const handleLogout = () => {
    // Use the provided onLogout prop if available
    if (onLogout) {
      onLogout();
    } else if (logout) {
      // Otherwise use the logout from AuthContext
      logout();
    } else {
      // Fallback to localStorage removal and console log
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      console.log("로그아웃 처리됨");
      window.location.href = "/login";
    }
  };

  // 현재 활성화된 섹션에 따라 컨텐츠 렌더링
  const renderContent = () => {
    switch (activeSection) {
      case "rideDetails":
        return (
          <RideDetails
            ride={selectedRide}
            onBack={() => setActiveSection("overview")}
            onCancel={handleCancelRide}
          />
        );
      case "overview":
        return (
          <div className="space-y-4 pb-20 bg-transparent">
            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">
                  예정된 스케줄
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {upcomingRides.length > 0 ? (
                    upcomingRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100 text-sm mb-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {ride.time} {ride.from} →{" "}
                              {ride.dropoffTime || ride.time} {ride.to}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {ride.isRecurring ? (
                              <>
                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs mr-1">
                                  정기
                                </span>
                                {`매주 ${ride.recurringDays || "월, 수, 금"}요일`}
                              </>
                            ) : (
                              new Date(ride.date).toLocaleDateString("ko-KR")
                            )}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => showRideDetails(ride)}
                        >
                          상세보기
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      예정된 이동이 없습니다
                    </p>
                  )}
                </div>
                <div className="flex justify-center mt-3">
                  <Button
                    className="w-[335px] h-[48px] px-4 py-2 rounded-lg bg-[#1A1D2A] text-white font-medium shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)] hover:bg-[#252A3B] transition-colors"
                    onClick={() => setActiveSection("schedule")}
                  >
                    일정 예약하기
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">
                  이용권 현황
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">
                        10회권 (11회 이용 가능)
                      </span>
                      <span className="text-xs font-medium text-[#E54141]">
                        남은 회수: 8회
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: "27%",
                          background:
                            "linear-gradient(to right, #2B2E3B, #1A1D2A)",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">사용: 3회</span>
                      <span className="text-xs text-gray-500">
                        만료일:{" "}
                        {new Date(
                          new Date().setDate(new Date().getDate() + 60),
                        ).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-xs text-gray-500">
                      이용권은 구매일로부터 90일간 유효합니다.
                    </p>
                    <p className="text-xs text-gray-500">
                      이동 시간이 1시간을 초과하는 경우 일정 등록 불가
                    </p>
                  </div>

                  <div className="flex justify-center mt-3">
                    <CustomButton
                      label="이용권 충전하기"
                      variant="outline"
                      onClick={() => setActiveSection("recharge")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">
                  등록된 주소
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="space-y-2 mb-3">
                  {savedLocations.slice(0, 3).map((location) => (
                    <div
                      key={location.id}
                      className="p-2 bg-gray-50 rounded-md border border-gray-100 text-sm"
                    >
                      <p className="font-medium">{location.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {location.address}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-3">
                  <CustomButton
                    label="내 정보 관리하기"
                    variant="outline"
                    onClick={() => setActiveSection("profile")}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">
                  이용내역
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100 text-sm mb-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {ride.time} {ride.from} →{" "}
                            {ride.dropoffTime || ride.time} {ride.to}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {ride.isRecurring ? (
                            <>
                              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs mr-1">
                                정기
                              </span>
                              {`매주 ${ride.recurringDays || "월, 수, 금"}요일`}
                            </>
                          ) : (
                            new Date(ride.date).toLocaleDateString("ko-KR")
                          )}
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        완료됨
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-3">
                  <CustomButton
                    label="모든 이용내역 보기"
                    variant="outline"
                    onClick={() => setActiveSection("history")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "schedule":
        return (
          <div className="pb-20 bg-transparent">
            <BookingFlow />
          </div>
        );
      case "profile":
        return <ProfileManager />;
      case "history":
        return (
          <div className="pb-20">
            <h2 className="text-xl font-bold mb-4">이동 이용내역</h2>
            <div className="space-y-3">
              {[...recentRides, ...upcomingRides].map((ride) => (
                <div
                  key={ride.id}
                  className="border rounded-lg p-4 flex flex-col space-y-3 bg-white mb-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">
                        {ride.time} {ride.from} →{" "}
                        {ride.dropoffTime || ride.time} {ride.to}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${ride.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {ride.status === "completed" ? "완료됨" : "예정됨"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {ride.isRecurring ? (
                      <>
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs mr-1">
                          정기
                        </span>
                        {`매주 ${ride.recurringDays || "월, 수, 금"}요일`}
                      </>
                    ) : (
                      new Date(ride.date).toLocaleDateString("ko-KR")
                    )}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs self-end"
                    onClick={() => showRideDetails(ride)}
                  >
                    상세보기
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      case "recharge":
        return (
          <div className="pb-20">
            <PaymentFlow onComplete={() => setActiveSection("overview")} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-[390px] mx-auto relative overflow-hidden">
      {activeSection === "overview" && (
        <NavigationMenu userName={userName} onLogout={handleLogout} />
      )}
      <main className="px-4 py-6 overflow-y-auto h-[calc(100vh-120px)] no-scrollbar">
        {renderContent()}
      </main>
      {/* 하단 GNB 네비게이션 */}
      <GNB activeSection={activeSection} onChangeSection={setActiveSection} />
    </div>
  );
};

export default Dashboard;
