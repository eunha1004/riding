import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  TimePicker,
  Space,
  Typography,
  Alert,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { getSavedLocations, Location } from "@/lib/locationStore";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface RouteBuilderProps {
  savedLocations?: Location[];
}

interface Route {
  id: string;
  name: string;
  pickup: string;
  dropoff: string;
  time: string;
}

const AntRouteBuilder = ({
  savedLocations: propLocations = [],
}: RouteBuilderProps) => {
  const [savedLocations, setSavedLocations] =
    useState<Location[]>(propLocations);

  // Load saved locations from localStorage
  useEffect(() => {
    if (propLocations.length === 0) {
      const locations = getSavedLocations();
      setSavedLocations(locations);
    }
  }, [propLocations]);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "route1",
      name: "등교",
      pickup: savedLocations.length > 0 ? savedLocations[0].name : "",
      dropoff: savedLocations.length > 1 ? savedLocations[1].name : "",
      time: "오전 7:30",
    },
  ]);

  const addRoute = () => {
    if (routes.length < 5) {
      setRoutes([
        ...routes,
        {
          id: `route${routes.length + 1}`,
          name: "",
          pickup: "",
          dropoff: "",
          time: "",
        },
      ]);
    }
  };

  const removeRoute = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  const updateRouteName = (id: string, name: string) => {
    setRoutes(
      routes.map((route) => (route.id === id ? { ...route, name } : route)),
    );
  };

  const updateRoutePickup = (id: string, pickup: string) => {
    setRoutes(
      routes.map((route) => (route.id === id ? { ...route, pickup } : route)),
    );
  };

  const updateRouteDropoff = (id: string, dropoff: string) => {
    setRoutes(
      routes.map((route) => (route.id === id ? { ...route, dropoff } : route)),
    );
  };

  const updateRouteTime = (id: string, time: string) => {
    setRoutes(
      routes.map((route) => (route.id === id ? { ...route, time } : route)),
    );
  };

  const goToLocationManager = () => {
    alert("주소 관리 페이지로 이동합니다.");
  };

  const locationOptions = savedLocations.map((location) => ({
    value: location.name,
    label: `${location.name} (${location.address})`,
  }));

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Card className="w-full">
        <div className="flex justify-between items-center mb-4">
          <Space>
            <EnvironmentOutlined />
            <Title level={5} style={{ margin: 0 }}>
              경로 설정
            </Title>
          </Space>
        </div>

        {savedLocations.length === 0 ? (
          <Alert
            message="등록된 주소가 없습니다"
            description={
              <div>
                경로를 설정하기 위해서는 먼저 주소를 등록해야 합니다.
                <Button type="link" size="small" onClick={goToLocationManager}>
                  주소 관리 페이지로 이동하기
                </Button>
              </div>
            }
            type="error"
            showIcon
          />
        ) : (
          <div className="space-y-4">
            {routes.map((route, index) => (
              <Card
                key={route.id}
                size="small"
                className="w-full mb-4"
                title={
                  <div className="flex justify-between items-center">
                    <Text>경로 {index + 1}</Text>
                    {routes.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeRoute(route.id)}
                      />
                    )}
                  </div>
                }
              >
                <Form layout="vertical">
                  <Form.Item label="경로 이름">
                    <Input
                      placeholder="경로 이름 입력"
                      value={route.name}
                      onChange={(e) =>
                        updateRouteName(route.id, e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label="출발지">
                    <Select
                      placeholder="출발지 선택"
                      options={locationOptions}
                      value={route.pickup || undefined}
                      onChange={(value) => updateRoutePickup(route.id, value)}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item label="도착지">
                    <Select
                      placeholder="도착지 선택"
                      options={locationOptions}
                      value={route.dropoff || undefined}
                      onChange={(value) => updateRouteDropoff(route.id, value)}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item label="시간">
                    <TimePicker
                      format="a h:mm"
                      placeholder="시간 선택"
                      style={{ width: "100%" }}
                      onChange={(time, timeString) =>
                        updateRouteTime(route.id, timeString)
                      }
                      allowClear
                    />
                  </Form.Item>
                </Form>
              </Card>
            ))}

            {routes.length < 5 && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addRoute}
                className="w-full"
              >
                경로 추가 (최대 5개)
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntRouteBuilder;
