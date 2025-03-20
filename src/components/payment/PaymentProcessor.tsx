import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle } from "lucide-react";

interface PaymentProcessorProps {
  amount?: number;
  onPaymentComplete?: (success: boolean) => void;
}

const PaymentProcessor = ({
  amount = 215800,
  onPaymentComplete = () => {},
}: PaymentProcessorProps) => {
  const handlePayment = () => {
    // 결제 처리 시뮬레이션
    setTimeout(() => {
      onPaymentComplete(true);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          결제 정보 입력
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">카드 번호</label>
            <div className="p-2 border rounded-md text-sm">
              •••• •••• •••• 1234
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-medium">만료일</label>
              <div className="p-2 border rounded-md text-sm">12/25</div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">CVC</label>
              <div className="p-2 border rounded-md text-sm">•••</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">카드 소유자 이름</label>
            <div className="p-2 border rounded-md text-sm">김지연</div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between font-bold mb-4">
              <span>결제 금액:</span>
              <span>₩{amount.toLocaleString()}</span>
            </div>
            <Button className="w-full text-xs" onClick={handlePayment}>
              ₩{amount.toLocaleString()} 결제하기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
