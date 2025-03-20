import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Divider,
} from "antd";
import { CreditCardOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface PaymentProcessorProps {
  amount?: number;
  onPaymentComplete?: (success: boolean) => void;
}

const AntPaymentProcessor = ({
  amount = 215800,
  onPaymentComplete = () => {},
}: PaymentProcessorProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handlePayment = () => {
    form.validateFields().then(() => {
      setLoading(true);
      // 결제 처리 시뮬레이션
      setTimeout(() => {
        setLoading(false);
        onPaymentComplete(true);
      }, 1500);
    });
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Card
        title={
          <Space>
            <CreditCardOutlined />
            <span>결제 정보 입력</span>
          </Space>
        }
        className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="카드 번호"
            name="cardNumber"
            rules={[{ required: true, message: "카드 번호를 입력해주세요" }]}
            extra={
              <Text type="secondary" className="text-xs">
                보안 암호화 적용
              </Text>
            }
          >
            <Input.Group compact>
              <Input
                style={{ width: "25%" }}
                maxLength={4}
                placeholder="0000"
                defaultValue="1234"
              />
              <Input
                style={{ width: "25%" }}
                maxLength={4}
                placeholder="0000"
                defaultValue="••••"
              />
              <Input
                style={{ width: "25%" }}
                maxLength={4}
                placeholder="0000"
                defaultValue="••••"
              />
              <Input
                style={{ width: "25%" }}
                maxLength={4}
                placeholder="0000"
                defaultValue="9876"
              />
            </Input.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="만료일"
              name="expiry"
              rules={[{ required: true, message: "만료일을 입력해주세요" }]}
            >
              <Input placeholder="MM/YY" defaultValue="12/25" />
            </Form.Item>

            <Form.Item
              label="CVC"
              name="cvc"
              rules={[{ required: true, message: "CVC를 입력해주세요" }]}
            >
              <Input placeholder="000" defaultValue="•••" />
            </Form.Item>
          </div>

          <Form.Item
            label="카드 소유자 이름"
            name="cardholderName"
            rules={[
              { required: true, message: "카드 소유자 이름을 입력해주세요" },
            ]}
          >
            <Input placeholder="카드 소유자 이름" defaultValue="김지연" />
          </Form.Item>

          <Divider />

          <div className="flex justify-between items-center mb-4">
            <Text strong>결제 금액:</Text>
            <Text strong>₩{amount.toLocaleString()}</Text>
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={handlePayment}
            loading={loading}
          >
            ₩{amount.toLocaleString()} 결제하기
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AntPaymentProcessor;
