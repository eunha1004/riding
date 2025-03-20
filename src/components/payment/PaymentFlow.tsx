import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TicketRecharge from "./TicketRecharge";
import TossPaymentIntegration from "./TossPaymentIntegration";
import PaymentConfirmation from "./PaymentConfirmation";
import QuantityControl from "./QuantityControl";

interface PaymentFlowProps {
  onComplete?: () => void;
}

const PaymentFlow = ({ onComplete = () => {} }: PaymentFlowProps) => {
  const [paymentStep, setPaymentStep] = useState("select");
  const [selectedTicket, setSelectedTicket] = useState<{
    name: string;
    price: number;
    quantity?: number;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [orderId, setOrderId] = useState("");

  const handleSelectTicket = (
    ticketType: string,
    price: number,
    quantity: number = 1,
  ) => {
    setSelectedTicket({ name: ticketType, price, quantity });
    setPaymentStep("payment");
    // 주문 ID 생성 (실제로는 서버에서 생성하는 것이 좋습니다)
    setOrderId(`TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  };

  // 티켓 조합 계산 함수
  const calculateTicketCombination = (quantity: number, ticketType: string) => {
    // 기본 티켓 가격
    const singlePrice = 18030; // 1회권 기본 가격
    const tenPackPrice = 163630; // 10회권 가격

    // 티켓 유형에 따른 총 라이드 수 계산
    let totalRides = 0;
    if (ticketType === "1회권") {
      totalRides = 1 * quantity;
    } else if (ticketType === "10회권") {
      totalRides = 11 * quantity; // 10회권은 1회 보너스 포함
    } else if (ticketType === "30회권") {
      totalRides = 31 * quantity; // 30회권은 1회 보너스 포함
    }

    // 티켓 조합 계산
    let ticketDetails = [];

    if (totalRides <= 9) {
      // 9회 이하는 1회권으로 계산
      ticketDetails = [{ type: "1회권", count: totalRides }];
    } else {
      // 10회 이상은 10회권과 1회권 조합
      const tenPackCount = Math.floor(totalRides / 10);
      const remainingSingles = totalRides % 10;

      if (tenPackCount > 0) {
        ticketDetails.push({ type: "10회권", count: tenPackCount });
      }
      if (remainingSingles > 0) {
        ticketDetails.push({ type: "1회권", count: remainingSingles });
      }
    }

    return ticketDetails;
  };

  const handlePaymentSuccess = (
    paymentKey: string,
    orderId: string,
    amount: number,
  ) => {
    console.log("Payment successful:", { paymentKey, orderId, amount });
    setPaymentStatus("success");
    setPaymentStep("confirmation");
  };

  const handlePaymentFail = (errorCode: string, errorMsg: string) => {
    console.error("Payment failed:", { errorCode, errorMsg });
    setPaymentStatus("failed");
    setPaymentStep("confirmation");
  };

  const handleClose = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (selectedTicket) {
      // Calculate new price based on the base price per ticket
      const basePrice = selectedTicket.price / (selectedTicket.quantity || 1);
      setSelectedTicket({
        ...selectedTicket,
        quantity: newQuantity,
        price: basePrice * newQuantity,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden no-scrollbar">
      <Tabs value={paymentStep} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger
            value="select"
            onClick={() => setPaymentStep("select")}
            className="text-xs"
          >
            이용권 선택
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            disabled={!selectedTicket}
            className="text-xs"
          >
            결제 정보
          </TabsTrigger>
          <TabsTrigger
            value="confirmation"
            disabled={paymentStep !== "confirmation"}
            className="text-xs"
          >
            확인
          </TabsTrigger>
        </TabsList>

        <TabsContent value="select">
          <TicketRecharge onSelectTicket={handleSelectTicket} />
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
            <CardHeader className="bg-white">
              <CardTitle className="text-base flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                결제 정보 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              {selectedTicket && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">선택한 이용권:</span>
                      <div className="flex items-center">
                        <span className="mr-2">{selectedTicket.name}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <QuantityControl
                        quantity={selectedTicket.quantity || 1}
                        onQuantityChange={handleQuantityChange}
                        minQuantity={1}
                        maxQuantity={10}
                      />
                    </div>

                    {/* 티켓 조합 표시 */}

                    <div className="flex justify-between items-center font-bold">
                      <span>결제 금액:</span>
                      <span>₩{selectedTicket.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">결제 방법 선택</h3>
                    <TossPaymentIntegration
                      amount={selectedTicket.price}
                      orderId={orderId}
                      orderName={`대치라이드 ${selectedTicket.name} 이용권`}
                      customerName="김지연"
                      onSuccess={handlePaymentSuccess}
                      onFail={handlePaymentFail}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmation">
          {paymentStatus === "success" ? (
            <PaymentConfirmation
              ticketType={selectedTicket?.name || ""}
              price={selectedTicket?.price || 0}
              purchaseDate={new Date()}
              expiryDate={
                new Date(new Date().setDate(new Date().getDate() + 90))
              }
              onClose={handleClose}
              quantity={selectedTicket?.quantity || 1}
            />
          ) : (
            <Card className="shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  결제 실패
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div className="py-6">
                    <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      결제에 실패했습니다
                    </h3>
                    <p className="text-sm text-gray-500">
                      결제 정보를 확인하고 다시 시도해주세요.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => setPaymentStep("select")}
                    >
                      이용권 다시 선택
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setPaymentStep("payment")}
                    >
                      다시 시도하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentFlow;
