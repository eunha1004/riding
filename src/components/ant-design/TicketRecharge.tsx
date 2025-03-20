import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Radio,
  Tag,
  Tooltip,
  List,
  Divider,
} from "antd";
import { CheckOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Group } = Radio;

interface TicketRechargeProps {
  onSelectTicket?: (ticketType: string, price: number) => void;
}

const AntTicketRecharge = ({
  onSelectTicket = () => {},
}: TicketRechargeProps) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const tickets = [
    {
      id: "single",
      name: "1회권",
      price: 18000,
      rides: 1,
      bonus: 0,
      pricePerRide: 18000,
      popular: false,
    },
    {
      id: "ten",
      name: "10회권",
      price: 180000,
      rides: 10,
      bonus: 1,
      pricePerRide: 16364,
      popular: true,
    },
    {
      id: "thirty",
      name: "30회권",
      price: 540000,
      rides: 30,
      bonus: 4,
      pricePerRide: 15882,
      popular: false,
    },
  ];

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  const handleProceedToPayment = () => {
    if (!selectedTicket) return;
    const ticket = tickets.find((t) => t.id === selectedTicket);
    if (ticket) {
      onSelectTicket(ticket.name, ticket.price);
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Title level={4}>이용권 충전</Title>
      <div className="space-y-4">
        <Radio.Group
          onChange={(e) => handleSelectTicket(e.target.value)}
          value={selectedTicket}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={`w-full cursor-pointer shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)] ${selectedTicket === ticket.id ? "border-primary" : ""}`}
                onClick={() => handleSelectTicket(ticket.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <Space>
                      <Text strong>{ticket.name}</Text>
                      {ticket.bonus > 0 && (
                        <Tag color="success">+{ticket.bonus}회 추가 제공</Tag>
                      )}
                      {ticket.popular && <Tag color="processing">인기</Tag>}
                    </Space>
                    <div className="mt-2">
                      <Title level={3} style={{ margin: 0 }}>
                        ₩{ticket.price.toLocaleString()}
                      </Title>
                    </div>
                    <div className="mt-1">
                      <Space>
                        <Text type="secondary">
                          {ticket.rides + ticket.bonus}회 이용 가능 (회당{" "}
                          {Math.round(
                            ticket.price / (ticket.rides + ticket.bonus),
                          ).toLocaleString()}
                          원)
                        </Text>
                        <Tooltip
                          title={`기본 ${ticket.rides}회 + 추가 ${ticket.bonus}회`}
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    </div>

                    {ticket.bonus > 0 && (
                      <div className="mt-3 bg-green-50 p-2 rounded-md">
                        <Space>
                          <CheckOutlined className="text-green-600" />
                          <Text className="text-green-800">
                            <Text strong className="text-green-800">
                              추가 혜택:
                            </Text>{" "}
                            {ticket.bonus}회 무료 이용권이 추가로 제공됩니다.
                            (총 {ticket.rides + ticket.bonus}회)
                          </Text>
                        </Space>
                      </div>
                    )}

                    <div className="mt-3 flex justify-between">
                      <Text>
                        <Text strong>회당 가격:</Text>{" "}
                        <Text type="danger">
                          ₩{ticket.pricePerRide.toLocaleString()}
                        </Text>
                      </Text>
                      {ticket.id !== "single" && (
                        <Text>
                          <Text strong>할인율:</Text>{" "}
                          <Text type="success">
                            {Math.round(
                              ((18030 - ticket.pricePerRide) / 18030) * 100,
                            )}
                            %
                          </Text>
                        </Text>
                      )}
                    </div>
                  </div>
                  <Radio value={ticket.id} />
                </div>
              </Card>
            ))}
          </Space>
        </Radio.Group>

        <Card className="bg-gray-50 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
          <Title level={5}>이용권 정책 안내</Title>
          <List
            size="small"
            dataSource={[
              "10회권 구매 시 1회 추가 제공됩니다 (총 11회), 30회권 구매 시 4회 추가 제공됩니다 (총 34회)",
              "이용권은 구매일로부터 90일간 유효합니다.",
              "이동 시간이 1시간을 초과하는 경우 일정 등록이 불가합니다.",
              "장소 및 시작 시간 등록 시 자동으로 예상 이동 시간이 계산됩니다.",
            ]}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <CheckOutlined className="text-green-600" />
                  <Text>{item}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <Button
          type="primary"
          size="large"
          block
          disabled={!selectedTicket}
          onClick={handleProceedToPayment}
        >
          다음 단계로
        </Button>
      </div>
    </div>
  );
};

export default AntTicketRecharge;
