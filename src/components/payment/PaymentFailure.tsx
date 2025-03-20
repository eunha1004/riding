import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface PaymentFailureProps {
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

const PaymentFailure = ({
  errorMessage = "결제 처리 중 오류가 발생했습니다.",
  errorCode = "ERROR-1001",
  onRetry = () => {},
  onCancel = () => {},
}: PaymentFailureProps) => {
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-transparent">
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">결제 실패</h2>
        <p className="text-muted-foreground mb-6">
          결제가 정상적으로 처리되지 않았습니다.
        </p>

        <Card className="bg-white shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">오류 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">오류 메시지</span>
                <span className="text-red-600">{errorMessage}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">오류 코드</span>
                <span className="font-mono text-sm">{errorCode}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <p>
                  결제 중 문제가 발생했습니다. 카드 정보를 확인하시거나 다른
                  결제 수단을 이용해 주세요. 문제가 계속되면 고객센터로 문의해
                  주세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={onRetry}>
            다시 시도하기
          </Button>
          <Button variant="outline" className="w-full" onClick={onCancel}>
            결제 취소하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
