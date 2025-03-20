import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Radio,
  DatePicker,
  Space,
  Typography,
  Alert,
  Divider,
  Calendar,
  Checkbox,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import AntRouteBuilder from "./RouteBuilder";
import { getSavedLocations, Location } from "@/lib/locationStore";
import dayjs from "dayjs";
import "dayjs/locale/ko";

const { Title, Text } = Typography;
const { Group } = Radio;

interface RideSchedulerProps {
  savedLocations?: Location[];
}

const AntRideScheduler = ({
  savedLocations: propLocations = [],
}: RideSchedulerProps) => {
  const [savedLocations, setSavedLocations] =
    useState<Location[]>(propLocations);

  // Load saved locations from localStorage
  useEffect(() => {
    if (propLocations.length === 0) {
      const locations = getSavedLocations();
      setSavedLocations(locations);
    }
  }, [propLocations]);

  const [rideType, setRideType] = useState("one-time");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs().add(30, "day"));
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "월",
    "화",
    "수",
    "목",
    "금",
  ]);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const goToLocationManager = () => {
    alert("주소 관리 페이지로 이동합니다.");
  };

  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="w-full max-w-[390px] mx-auto">
      {savedLocations.length === 0 ? (
        <Alert
          message="등록된 주소가 없습니다"
          description={
            <div>
              이동 일정을 예약하기 위해서는 먼저 주소를 등록해야 합니다.
              <Button type="link" size="small" onClick={goToLocationManager}>
                주소 관리 페이지로 이동하기
              </Button>
            </div>
          }
          type="error"
          showIcon
          className="mb-4"
        />
      ) : (
        <div className="space-y-4">
          <Card className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
            <Group
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              buttonStyle="solid"
              className="w-full mb-4"
            >
              <Radio.Button value="one-time" className="w-1/2 text-center">
                일회성 이동
              </Radio.Button>
              <Radio.Button value="recurring" className="w-1/2 text-center">
                정기 이동
              </Radio.Button>
            </Group>

            {rideType === "one-time" ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Space>
                    <CalendarOutlined />
                    <Title level={5} style={{ margin: 0 }}>
                      날짜
                    </Title>
                  </Space>
                </div>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => date && setSelectedDate(date)}
                  className="w-full mb-4"
                  format="YYYY년 MM월 DD일"
                />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Space>
                    <ClockCircleOutlined />
                    <Title level={5} style={{ margin: 0 }}>
                      요일 선택
                    </Title>
                  </Space>
                </div>

                <div className="mb-4">
                  <Checkbox.Group
                    value={selectedDays}
                    onChange={(checkedValues) =>
                      setSelectedDays(checkedValues as string[])
                    }
                    className="w-full grid grid-cols-7 gap-1"
                  >
                    {weekDays.map((day) => (
                      <Checkbox key={day} value={day} className="text-center">
                        {day}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                <div className="space-y-2 mb-4">
                  <Text>시작 날짜</Text>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => date && setStartDate(date)}
                    className="w-full"
                    format="YYYY년 MM월 DD일"
                  />

                  <Text>종료 날짜</Text>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    className="w-full"
                    format="YYYY년 MM월 DD일"
                  />
                </div>
              </div>
            )}
          </Card>

          <AntRouteBuilder savedLocations={savedLocations} />

          <div className="flex justify-end">
            <Button type="primary">다음: 결제 정보</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AntRideScheduler;
