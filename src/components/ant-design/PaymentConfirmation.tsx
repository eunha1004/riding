import React from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Result,
  Descriptions,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface PaymentConfirmationProps {
  ticketType?: string;
  price?: number;
  purchaseDate?: Date;
  expiryDate?: Date;
  onClose?: () => void;
  status?: "pending" | "success" | "failed";
}

const AntPaymentConfirmation = ({
  ticketType = "10회권",
  price = 163630,
  purchaseDate = new Date(),
  expiryDate = new Date(new Date().setDate(new Date().getDate() + 90)),
  onClose = () => {},
  status = "success",
}: PaymentConfirmationProps) => {
  // 추가 회수 계산
  const getBonus = () => {
    if (ticketType === "10회권") return 1;
    if (ticketType === "30회권") return 4;
    return 0;
  };

  // 총 이용 가능 회수 계산
  const getTotalRides = () => {
    if (ticketType === "1회권") return 1;
    if (ticketType === "10회권") return 11;
    if (ticketType === "30회권") return 34;
    return 0;
  };

  if (status === "failed") {
    return (
      <div className="w-full max-w-[390px] mx-auto">
        <Result
          status="error"
          title="결제에 실패했습니다"
          subTitle="결제 정보를 확인하고 다시 시도해주세요."
          extra={[
            <Button key="retry" type="primary" onClick={onClose}>
              다시 시도하기
            </Button>,
            <Button key="back" onClick={onClose}>
              대시보드로 돌아가기
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Result
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        title="결제가 완료되었습니다"
        subTitle="이용권이 성공적으로 충전되었습니다."
        extra={[
          <Button key="dashboard" type="primary" onClick={onClose}>
            대시보드로 돌아가기
          </Button>,
          <Button key="receipt">영수증 저장하기</Button>,
        ]}
      >
        <Card className="w-full mt-4 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
          <Descriptions title="결제 정보" column={1} bordered>
            <Descriptions.Item label="이용권 종류">
              {ticketType}
            </Descriptions.Item>
            <Descriptions.Item label="결제 금액">
              ₩{price.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="이용 가능 횟수">
              <Space direction="vertical" size={0}>
                <Text strong>{getTotalRides()}회</Text>
                {getBonus() > 0 && (
                  <Text type="success">(+{getBonus()}회 추가 제공)</Text>
                )}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="구매일">
              <Space>
                <CalendarOutlined />
                {purchaseDate.toLocaleDateString()}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="유효기간">
              <Space>
                <ClockCircleOutlined />
                {expiryDate.toLocaleDateString()} 까지
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Result>
    </div>
  );
};

export default AntPaymentConfirmation;
