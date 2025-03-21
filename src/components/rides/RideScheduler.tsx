import React, { useState, useEffect } from "react";
import TabBarSmall from "@/components/ui/tab-bar-small";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import RouteBuilder from "./RouteBuilder";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSavedLocations, Location } from "@/lib/locationStore";
import BookingPaymentFlow from "../payment/BookingPaymentFlow";

interface RideSchedulerProps {
  savedLocations?: Location[];
}

const RideScheduler = ({
  savedLocations: propLocations = [],
}: RideSchedulerProps) => {
  // 상태 변수들을 먼저 선언
  const [showPayment, setShowPayment] = useState(false);
  const [rideType, setRideType] = useState("one-time");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    addDays(new Date(), 30),
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "월",
    "화",
    "수",
    "목",
    "금",
  ]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [savedLocations, setSavedLocations] =
    useState<Location[]>(propLocations);

  // Load saved locations from localStorage
  useEffect(() => {
    try {
      if (propLocations.length === 0) {
        const locations = getSavedLocations();
        setSavedLocations(locations);
      }
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  }, [propLocations]);

  // Store route data in sessionStorage when navigating to payment
  useEffect(() => {
    try {
      if (showPayment) {
        // Save current state to sessionStorage
        const stateToSave = {
          rideType,
          selectedDate,
          startDate,
          endDate,
          selectedDays,
          routes,
        };
        sessionStorage.setItem(
          "rideSchedulerState",
          JSON.stringify(stateToSave),
        );
      }
    } catch (error) {
      console.error("Error saving state to sessionStorage:", error);
    }
  }, [
    showPayment,
    rideType,
    selectedDate,
    startDate,
    endDate,
    selectedDays,
    routes,
  ]);

  // Load saved state from sessionStorage when component mounts
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem("rideSchedulerState");
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setRideType(parsedState.rideType || "one-time");
          setSelectedDate(
            parsedState.selectedDate
              ? new Date(parsedState.selectedDate)
              : new Date(),
          );
          setStartDate(
            parsedState.startDate
              ? new Date(parsedState.startDate)
              : new Date(),
          );
          setEndDate(
            parsedState.endDate
              ? new Date(parsedState.endDate)
              : addDays(new Date(), 30),
          );
          setSelectedDays(
            parsedState.selectedDays || ["월", "화", "수", "목", "금"],
          );
          setRoutes(parsedState.routes || []);
        } catch (error) {
          console.error("Error parsing saved state:", error);
        }
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
    }
  }, []);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const goToLocationManager = () => {
    // 실제 앱에서는 navigate를 사용하여 주소 관리 페이지로 이동
    // 현재는 Dashboard 컴포넌트에서 activeSection을 변경하는 방식으로 구현되어 있음
    alert("주소 관리 페이지로 이동합니다.");
  };

  const handleRouteChange = (updatedRoutes: any[]) => {
    setRoutes(updatedRoutes);
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handleBackToSchedule = () => {
    setShowPayment(false);
  };

  const getBookingDetails = () => {
    return {
      bookingType: rideType as "one-time" | "recurring",
      date: selectedDate,
      startDate,
      endDate,
      selectedDays,
      routes,
    };
  };

  return (
    <div className="w-full overflow-y-auto max-h-[90vh] no-scrollbar bg-white">
      {showPayment ? (
        <div className="w-full">
          <BookingPaymentFlow
            bookingDetails={getBookingDetails()}
            onComplete={() => window.location.href = "/"}
            onBack={handleBackToSchedule}
          />
        </div>
      ) : savedLocations.length === 0 ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>등록된 주소가 없습니다</AlertTitle>
          <AlertDescription>
            이동 일정을 예약하기 위해서는 먼저 주소를 등록해야 합니다.
            <Button
              variant="link"
              className="p-0 h-auto text-xs mt-1"
              onClick={goToLocationManager}
            >
              주소 관리 페이지로 이동하기
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <TabBarSmall
            activeTab={rideType}
            onTabChange={setRideType}
            tabs={[
              { id: "one-time", label: "일회성 이동" },
              { id: "recurring", label: "정기 이동" },
            ]}
          />

          {rideType === "one-time" ? (
            <div className="mb-3">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-base font-medium">날짜</h3>
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild className="shadow-none">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal text-sm h-10"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: ko })
                          ) : (
                            <span>날짜 선택</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-base font-medium">요일 선택</h3>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <Button
                      key={day}
                      variant={
                        selectedDays.includes(day) ? "default" : "outline"
                      }
                      className="h-10 text-xs p-0 shadow-none"
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium">시작 날짜</p>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild className="shadow-none">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-sm h-10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP", { locale: ko })
                        ) : (
                          <span>시작 날짜 선택</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setStartDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs font-medium">종료 날짜</p>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild className="shadow-none">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-sm h-10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP", { locale: ko })
                        ) : (
                          <span>종료 날짜 선택</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          setEndDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <RouteBuilder
              savedLocations={savedLocations}
              onRoutesChange={handleRouteChange}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              className="text-xs"
              onClick={handleProceedToPayment}
              disabled={
                routes.length === 0 ||
                routes.some(
                  (route) =>
                    route.name === "" ||
                    route.pickup === "" ||
                    route.dropoff === "" ||
                    route.pickupTime === "" ||
                    route.dropoffTime === "",
                ) ||
                routes.some((route) => {
                  // Check if pickup and dropoff times exist
                  if (!route.pickupTime || !route.dropoffTime) return false;

                  // Parse time strings
                  const pickupPeriodMatch =
                    route.pickupTime.match(/(오전|오후)/);
                  const pickupTimeMatch = route.pickupTime.match(/(\d+):(\d+)/);
                  const dropoffPeriodMatch =
                    route.dropoffTime.match(/(오전|오후)/);
                  const dropoffTimeMatch =
                    route.dropoffTime.match(/(\d+):(\d+)/);

                  if (
                    !pickupPeriodMatch ||
                    !pickupTimeMatch ||
                    !dropoffPeriodMatch ||
                    !dropoffTimeMatch
                  )
                    return false;

                  // Extract time components
                  const pickupPeriod = pickupPeriodMatch[0];
                  let pickupHour = parseInt(pickupTimeMatch[1]);
                  const pickupMinute = parseInt(pickupTimeMatch[2]);

                  const dropoffPeriod = dropoffPeriodMatch[0];
                  let dropoffHour = parseInt(dropoffTimeMatch[1]);
                  const dropoffMinute = parseInt(dropoffTimeMatch[2]);

                  // Convert to 24-hour format
                  if (pickupPeriod === "오후" && pickupHour < 12)
                    pickupHour += 12;
                  if (pickupPeriod === "오전" && pickupHour === 12)
                    pickupHour = 0;

                  if (dropoffPeriod === "오후" && dropoffHour < 12)
                    dropoffHour += 12;
                  if (dropoffPeriod === "오전" && dropoffHour === 12)
                    dropoffHour = 0;

                  // Calculate time difference in minutes
                  const pickupMinutes = pickupHour * 60 + pickupMinute;
                  const dropoffMinutes = dropoffHour * 60 + dropoffMinute;
                  const diffMinutes = dropoffMinutes - pickupMinutes;

                  // Check if time difference is valid (not exceeding 60 minutes and positive)
                  return !(diffMinutes <= 60 && diffMinutes > 0);
                }) ||
                (rideType === "one-time" && !selectedDate) ||
                (rideType === "recurring" &&
                  (!startDate || !endDate || selectedDays.length === 0))
              }
            >
              다음: 결제 정보
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RideScheduler;
