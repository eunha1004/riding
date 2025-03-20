import React, { useState } from "react";
import {
  Card,
  Steps,
  Button,
  Space,
  Typography,
  Divider,
  Tag,
  List,
} from "antd";
import {
  CreditCardOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AntTicketRecharge from "./TicketRecharge";
import AntPaymentProcessor from "./PaymentProcessor";
import AntPaymentConfirmation from "./PaymentConfirmation";

const { Title, Text, Paragraph } = Typography;

interface PaymentFlowProps {
  onComplete?: () => void;
}

const AntPaymentFlow = ({ onComplete = () => {} }: PaymentFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [orderId, setOrderId] = useState("");

  const handleSelectTicket = (ticketType: string, price: number) => {
    setSelectedTicket({ name: ticketType, price });
    setCurrentStep(1);
    // 주문 ID 생성 (실제로는 서버에서 생성하는 것이 좋습니다)
    setOrderId(`TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  };

  const handlePaymentSuccess = (
    paymentKey: string,
    orderId: string,
    amount: number,
  ) => {
    console.log("Payment successful:", { paymentKey, orderId, amount });
    setPaymentStatus("success");
    setCurrentStep(2);
  };

  const handlePaymentFail = (errorCode: string, errorMsg: string) => {
    console.error("Payment failed:", { errorCode, errorMsg });
    setPaymentStatus("failed");
    setCurrentStep(2);
  };

  const handleClose = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const steps = [
    {
      title: "이용권 선택",
      content: <AntTicketRecharge onSelectTicket={handleSelectTicket} />,
    },
    {
      title: "결제 정보",
      content: selectedTicket ? (
        <AntPaymentProcessor
          amount={selectedTicket.price}
          onPaymentComplete={(success) => {
            if (success) {
              handlePaymentSuccess(
                "SIMULATED_KEY",
                orderId,
                selectedTicket.price,
              );
            } else {
              handlePaymentFail(
                "PAYMENT_ERROR",
                "결제 처리 중 오류가 발생했습니다.",
              );
            }
          }}
        />
      ) : null,
    },
    {
      title: "확인",
      content: (
        <AntPaymentConfirmation
          ticketType={selectedTicket?.name || ""}
          price={selectedTicket?.price || 0}
          purchaseDate={new Date()}
          expiryDate={new Date(new Date().setDate(new Date().getDate() + 90))}
          onClose={handleClose}
          status={paymentStatus}
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Card className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
        <Steps
          current={currentStep}
          items={[
            { title: "이용권 선택" },
            { title: "결제 정보" },
            { title: "확인" },
          ]}
          className="mb-6"
        />
        <div className="py-4">{steps[currentStep].content}</div>
      </Card>
    </div>
  );
};

export default AntPaymentFlow;
