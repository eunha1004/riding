import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Progress,
  Tag,
  List,
  Typography,
  Space,
  Avatar,
  Divider,
} from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CarOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ChevronRight } from "lucide-react";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

interface DashboardProps {
  userName?: string;
  onLogout?: () => void;
}

const AntDashboard = ({
  userName = "김지연",
  onLogout = () => console.log("로그아웃 클릭됨"),
}: DashboardProps) => {
  const [activeSection, setActiveSection] = useState("overview");

  // 대시보드용 샘플 데이터
  const upcomingRides = [
    {
      id: "ride1",
      date: "2023-06-15",
      time: "오전 7:30",
      from: "집",
      to: "학교",
      status: "scheduled",
    },
    {
      id: "ride2",
      date: "2023-06-15",
      time: "오후 3:30",
      from: "학교",
      to: "집",
      status: "scheduled",
    },
    {
      id: "ride3",
      date: "2023-06-16",
      time: "오전 7:30",
      from: "집",
      to: "학교",
      status: "scheduled",
    },
  ];

  const recentRides = [
    {
      id: "past1",
      date: "2023-06-14",
      time: "오후 3:30",
      from: "학교",
      to: "집",
      status: "completed",
    },
    {
      id: "past2",
      date: "2023-06-14",
      time: "오전 7:30",
      from: "집",
      to: "학교",
      status: "completed",
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
      case "locations":
        return "위치 관리";
      case "history":
        return "이용내역";
      case "recharge":
        return "이용권 충전";
      default:
        return "대시보드";
    }
  };

  const showRideDetails = (ride) => {
    window.alert(
      `예약 정보:\n출발지: ${ride.from}\n도착지: ${ride.to}\n날짜: ${new Date(ride.date).toLocaleDateString("ko-KR")}\n시간: ${ride.time}\n상태: ${ride.status === "completed" ? "완료됨" : "예정됨"}\n예약번호: ${ride.id}`,
    );
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white px-4 flex justify-between items-center shadow-sm h-[64px] fixed w-full z-10">
        <div className="flex items-center">
          <Title level={4} className="text-primary m-0">
            대치라이드
          </Title>
        </div>
        <div className="flex items-center space-x-2">
          <Space>
            <Avatar icon={<UserOutlined />} size="small" />
            <Text>{userName}</Text>
            <Button type="link" size="small" onClick={onLogout}>
              로그아웃
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="pt-[64px] px-4 pb-[60px] max-w-[390px] mx-auto">
        <div className="py-4">
          <div className="space-y-4">
            <Card
              title={
                <Space>
                  <CalendarOutlined /> 예정된 동작 이동
                </Space>
              }
              size="small"
              className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]"
            >
              <List
                size="small"
                dataSource={upcomingRides}
                renderItem={(ride) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        size="small"
                        onClick={() => showRideDetails(ride)}
                        icon={<ChevronRight size={16} />}
                        style={{ padding: "4px" }}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Text strong>
                          {ride.from} → {ride.to}
                        </Text>
                      }
                      description={
                        <Text type="secondary">
                          {new Date(ride.date).toLocaleDateString("ko-KR")}{" "}
                          {ride.time}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: (
                    <Text type="secondary">예정된 이동이 없습니다</Text>
                  ),
                }}
              />
              <Button
                type="link"
                block
                onClick={() => setActiveSection("schedule")}
              >
                새 이동 일정 예약하기
              </Button>
            </Card>

            <Card
              title={
                <Space>
                  <BarChartOutlined /> 이용권 현황
                </Space>
              }
              size="small"
              className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Text type="secondary">10회권 (11회 이용 가능)</Text>
                    <Text type="warning">남은 회수: 8회</Text>
                  </div>
                  <Progress
                    percent={27}
                    showInfo={false}
                    strokeColor="#fa8c16"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <Text type="secondary" className="text-xs">
                      사용: 3회
                    </Text>
                    <Text type="secondary" className="text-xs">
                      만료일:{" "}
                      {new Date(
                        new Date().setDate(new Date().getDate() + 60),
                      ).toLocaleDateString("ko-KR")}
                    </Text>
                  </div>
                </div>

                <Card className="bg-yellow-50 border-yellow-200 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
                  <Space direction="vertical" size="small">
                    <Space>
                      <InfoCircleOutlined className="text-yellow-800" />
                      <Text strong className="text-yellow-800">
                        이용권 정책 안내
                      </Text>
                    </Space>
                    <ul className="text-xs text-yellow-700 pl-5 space-y-1 list-disc">
                      <li>
                        10회권 구매 시 1회 추가 제공 (총 11회), 30회권 구매 시
                        4회 추가 제공 (총 34회)
                      </li>
                      <li>이용권은 구매일로부터 90일간 유효합니다</li>
                      <li>이동 시간이 1시간을 초과하는 경우 일정 등록 불가</li>
                    </ul>
                  </Space>
                </Card>

                <Button block onClick={() => setActiveSection("recharge")}>
                  이용권 충전하기
                </Button>
              </div>
            </Card>

            <Card
              title={
                <Space>
                  <EnvironmentOutlined /> 저장된 위치
                </Space>
              }
              size="small"
              className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]"
            >
              <List
                size="small"
                dataSource={savedLocations.slice(0, 3)}
                renderItem={(location) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{location.name}</Text>}
                      description={
                        <Text type="secondary" ellipsis>
                          {location.address}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
              <Button
                type="link"
                block
                onClick={() => setActiveSection("locations")}
              >
                모든 위치 관리하기
              </Button>
            </Card>

            <Card
              title={
                <Space>
                  <ClockCircleOutlined /> 최근 활동
                </Space>
              }
              size="small"
              className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]"
            >
              <List
                size="small"
                dataSource={recentRides}
                renderItem={(ride) => (
                  <List.Item extra={<Tag color="success">완료됨</Tag>}>
                    <List.Item.Meta
                      title={
                        <Text strong>
                          {ride.from} → {ride.to}
                        </Text>
                      }
                      description={
                        <Text type="secondary">
                          {new Date(ride.date).toLocaleDateString("ko-KR")}{" "}
                          {ride.time}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
              <Button
                type="link"
                block
                onClick={() => setActiveSection("history")}
              >
                모든 이용내역 보기
              </Button>
            </Card>
          </div>
        </div>
      </Content>

      <Footer className="p-0 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <Menu
          mode="horizontal"
          selectedKeys={[activeSection]}
          className="flex justify-between border-0 max-w-[390px] mx-auto"
          onClick={(e) => setActiveSection(e.key)}
        >
          <Menu.Item
            key="overview"
            icon={<HomeOutlined />}
            className="flex-1 justify-center"
          >
            홈
          </Menu.Item>
          <Menu.Item
            key="schedule"
            icon={<CalendarOutlined />}
            className="flex-1 justify-center"
          >
            일정 예약
          </Menu.Item>
          <Menu.Item
            key="locations"
            icon={<EnvironmentOutlined />}
            className="flex-1 justify-center"
          >
            장소
          </Menu.Item>
          <Menu.Item
            key="history"
            icon={<ClockCircleOutlined />}
            className="flex-1 justify-center"
          >
            이용내역
          </Menu.Item>
        </Menu>
      </Footer>
    </Layout>
  );
};

export default AntDashboard;
