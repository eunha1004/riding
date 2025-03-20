import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2, AlertCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/select/index";
import { useNavigate } from "react-router-dom";
import TimeSelector from "./TimeSelector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSavedLocations, Location } from "@/lib/locationStore";
import {
  calculateDistance,
  calculateArrivalTime,
  isTimeGapValid,
} from "@/lib/naverMapsApi";

interface RouteBuilderProps {
  savedLocations?: Location[];
  onRoutesChange?: (routes: Route[]) => void;
}

interface Route {
  id: string;
  name: string;
  pickup: string;
  dropoff: string;
  pickupTime: string;
  dropoffTime: string;
}

const RouteBuilder = ({
  savedLocations: propLocations = [],
  onRoutesChange = () => {},
}: RouteBuilderProps) => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "route1",
      name: "등교",
      pickup: "",
      dropoff: "",
      pickupTime: "오전 7:30",
      dropoffTime: "오전 8:30",
    },
  ]);
  const [savedLocations, setSavedLocations] =
    useState<Location[]>(propLocations);

  // Load saved locations from localStorage
  useEffect(() => {
    if (propLocations.length === 0) {
      try {
        const locations = getSavedLocations();
        setSavedLocations(locations);
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    }
  }, [propLocations]);

  // Initialize routes from props if available
  useEffect(() => {
    if (
      savedLocations.length > 0 &&
      routes[0].pickup === "" &&
      routes[0].dropoff === ""
    ) {
      // Initialize with saved locations if available
      const updatedRoutes = [
        {
          id: "route1",
          name: "등교",
          pickup: savedLocations.length > 0 ? savedLocations[0].name : "",
          dropoff: savedLocations.length > 1 ? savedLocations[1].name : "",
          pickupTime: "오전 7:30",
          dropoffTime: "오전 8:30",
        },
      ];
      setRoutes(updatedRoutes);
      onRoutesChange(updatedRoutes);
    }
  }, [savedLocations, onRoutesChange, routes]);

  const addRoute = () => {
    if (routes.length < 5) {
      const updatedRoutes = [
        ...routes,
        {
          id: `route${routes.length + 1}`,
          name: "",
          pickup: "",
          dropoff: "",
          pickupTime: "",
          dropoffTime: "",
        },
      ];
      setRoutes(updatedRoutes);
      onRoutesChange(updatedRoutes);
    }
  };

  const removeRoute = (id: string) => {
    const updatedRoutes = routes.filter((route) => route.id !== id);
    setRoutes(updatedRoutes);
    onRoutesChange(updatedRoutes);
  };

  const updateRouteName = (id: string, name: string) => {
    const updatedRoutes = routes.map((route) =>
      route.id === id ? { ...route, name } : route,
    );
    setRoutes(updatedRoutes);
    onRoutesChange(updatedRoutes);
  };

  const updateRoutePickup = (id: string, pickup: string) => {
    const updatedRoutes = routes.map((route) =>
      route.id === id ? { ...route, pickup } : route,
    );
    setRoutes(updatedRoutes);
    onRoutesChange(updatedRoutes);
  };

  const updateRouteDropoff = (id: string, dropoff: string) => {
    const updatedRoutes = routes.map((route) =>
      route.id === id ? { ...route, dropoff } : route,
    );
    setRoutes(updatedRoutes);
    onRoutesChange(updatedRoutes);
  };

  const updateRoutePickupTime = async (id: string, pickupTime: string) => {
    const route = routes.find((r) => r.id === id);
    if (!route || !route.pickup || !route.dropoff) {
      // 출발지나 도착지가 없으면 기존 방식으로 계산
      const updatedRoutes = routes.map((route) => {
        if (route.id === id) {
          const dropoffTime = calculateDropoffTime(pickupTime);
          return { ...route, pickupTime, dropoffTime };
        }
        return route;
      });
      setRoutes(updatedRoutes);
      onRoutesChange(updatedRoutes);
      return;
    }

    try {
      // 출발지와 도착지 주소 찾기
      const pickupLocation = savedLocations.find(
        (loc) => loc.name === route.pickup,
      );
      const dropoffLocation = savedLocations.find(
        (loc) => loc.name === route.dropoff,
      );

      if (pickupLocation && dropoffLocation) {
        console.log(
          `출발지: ${pickupLocation.name}, 도착지: ${dropoffLocation.name}`,
        );

        // 네이버 API로 거리 및 소요시간 계산
        const distanceResult = await calculateDistance(
          pickupLocation.address,
          dropoffLocation.address,
        );

        let dropoffTime = pickupTime;
        if (distanceResult.isValid) {
          // 계산된 소요시간으로 도착 시간 설정
          dropoffTime = calculateArrivalTime(
            pickupTime,
            distanceResult.duration,
          );
          console.log(
            `출발 시간: ${pickupTime}, 소요 시간: ${distanceResult.duration}초, 도착 시간: ${dropoffTime}`,
          );
        } else {
          // API 실패 시 기본 계산 방식 사용
          dropoffTime = calculateDropoffTime(pickupTime);
          console.log(`API 실패, 기본 계산 방식 사용: ${dropoffTime}`);
        }

        const updatedRoutes = routes.map((r) => {
          if (r.id === id) {
            return { ...r, pickupTime, dropoffTime };
          }
          return r;
        });

        setRoutes(updatedRoutes);
        onRoutesChange(updatedRoutes);
      } else {
        // 주소 정보가 없으면 기존 방식으로 계산
        console.log("주소 정보를 찾을 수 없음, 기본 계산 방식 사용");
        const updatedRoutes = routes.map((route) => {
          if (route.id === id) {
            const dropoffTime = calculateDropoffTime(pickupTime);
            return { ...route, pickupTime, dropoffTime };
          }
          return route;
        });
        setRoutes(updatedRoutes);
        onRoutesChange(updatedRoutes);
      }
    } catch (error) {
      console.error("도착 시간 계산 중 오류:", error);
      // 오류 발생 시 기존 방식으로 계산
      const updatedRoutes = routes.map((route) => {
        if (route.id === id) {
          const dropoffTime = calculateDropoffTime(pickupTime);
          return { ...route, pickupTime, dropoffTime };
        }
        return route;
      });
      setRoutes(updatedRoutes);
      onRoutesChange(updatedRoutes);
    }
  };

  const updateRouteDropoffTime = (id: string, dropoffTime: string) => {
    const updatedRoutes = routes.map((route) =>
      route.id === id ? { ...route, dropoffTime } : route,
    );
    setRoutes(updatedRoutes);
    onRoutesChange(updatedRoutes);
  };

  // 출발 시간으로부터 도착 시간 계산 (기본 1시간 후)
  const calculateDropoffTime = (pickupTime: string): string => {
    if (!pickupTime) return "";

    // 시간 문자열 파싱 (예: "오전 7:30")
    const periodMatch = pickupTime.match(/(오전|오후)/);
    const timeMatch = pickupTime.match(/(\d+):(\d+)/);

    if (!periodMatch || !timeMatch) return "";

    const period = periodMatch[0]; // "오전" 또는 "오후"
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);

    // 12시간제에서 24시간제로 변환
    if (period === "오후" && hour < 12) hour += 12;
    if (period === "오전" && hour === 12) hour = 0;

    // 1시간 추가
    hour += 1;

    // 24시간제에서 12시간제로 다시 변환
    const newPeriod = hour < 12 ? "오전" : "오후";
    const newHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${newPeriod} ${newHour}:${minute === 0 ? "00" : minute}`;
  };

  // 이 함수는 naverMapsApi.ts로 이동했습니다

  const goToLocationManager = () => {
    // 실제 앱에서는 navigate를 사용하여 주소 관리 페이지로 이동
    // 현재는 Dashboard 컴포넌트에서 activeSection을 변경하는 방식으로 구현되어 있음
    alert("주소 관리 페이지로 이동합니다.");
  };

  const locationOptions = savedLocations.map((location) => ({
    value: location.name,
    label: `${location.name} (${location.address})`,
  }));

  return (
    <div>
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-base font-medium">경로 설정</h3>
        <MapPin className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-3">
        {savedLocations.length === 0 ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>등록된 주소가 없습니다</AlertTitle>
            <AlertDescription>
              경로를 설정하기 위해서는 먼저 주소를 등록해야 합니다.
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
          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.id}
                className="p-2 border rounded-md flex flex-col space-y-2 bg-white"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">
                    경로 {route.id.slice(-1)}
                  </span>
                  {routes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeRoute(route.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2 grow">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-20 text-xs">경로 이름:</div>
                    <Input
                      className="flex-1 text-xs h-10 shadow-none"
                      placeholder="경로 이름 입력"
                      value={route.name}
                      onChange={(e) =>
                        updateRouteName(route.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-20 text-xs">출발지:</div>
                    <div className="flex-1">
                      <CustomSelect
                        options={locationOptions}
                        value={route.pickup}
                        onChange={(value) => updateRoutePickup(route.id, value)}
                        placeholder="출발지 선택"
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-row mb-3 justify-center items-center">
                    <div className="w-20 text-xs">도착지:</div>
                    <div className="flex-1">
                      <CustomSelect
                        options={locationOptions}
                        value={route.dropoff}
                        onChange={(value) =>
                          updateRouteDropoff(route.id, value)
                        }
                        placeholder="도착지 선택"
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-20 text-xs">출발 시간:</div>
                    <div className="flex-1">
                      <TimeSelector
                        label="출발 시간 선택"
                        defaultTime={route.pickupTime}
                        onSelectTime={(time) =>
                          updateRoutePickupTime(route.id, time)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 text-xs">도착 시간:</div>
                    <div className="flex-1">
                      <TimeSelector
                        label="도착 시간"
                        defaultTime={route.dropoffTime}
                        disabled={true}
                      />
                    </div>
                  </div>
                  {route.pickup && route.dropoff && route.pickupTime && (
                    <div className="text-xs text-muted-foreground mt-1 ml-[5.5rem] flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>네이버 지도 기준</span>
                    </div>
                  )}
                  {route.pickupTime && route.dropoffTime && (
                    <>
                      {!isTimeGapValid(route.pickupTime, route.dropoffTime) && (
                        <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
                          <AlertCircle className="h-3 w-3 mr-1 inline-block" />
                          이동 시간은 1시간을 초과할 수 없습니다. 다른 시간을
                          선택해주세요.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {routes.length < 5 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-10 text-sm"
                onClick={addRoute}
              >
                <Plus className="h-3 w-3 mr-1" />
                경로 추가 (최대 5개)
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteBuilder;
