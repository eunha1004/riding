import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useTossPaymentsWidgets from "@/hooks/useTossPaymentsWidgets";

interface TossPaymentWidgetProps {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  onSuccess?: (paymentKey: string, orderId: string, amount: number) => void;
  onFail?: (code: string, message: string) => void;
}

const TossPaymentWidget = ({
  amount,
  orderId,
  orderName,
  customerName,
  onSuccess,
  onFail,
}: TossPaymentWidgetProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // 토스페이먼츠 위젯 훅 사용
  const {
    tossPaymentsWidgets,
    selectedPaymentMethod,
    agreedRequiredTerms,
    paymentMethodElement,
    agreementElement,
  } = useTossPaymentsWidgets({
    paymentAmount: amount,
  });

  const handlePayment = async () => {
    if (!agreedRequiredTerms) {
      toast({
        variant: "destructive",
        title: "결제 동의 필요",
        description: "결제를 진행하기 위해 필수 약관에 동의해주세요.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      toast({
        title: "결제 처리 중",
        description: "잠시만 기다려주세요...",
      });

      if (tossPaymentsWidgets && selectedPaymentMethod) {
        // 실제 토스페이먼츠 SDK를 사용하여 결제 처리
        try {
          await tossPaymentsWidgets.requestPayment({
            orderId: orderId,
            orderName: orderName,
            customerName: customerName,
            successUrl: `${window.location.origin}/payment/success`,
            failUrl: `${window.location.origin}/payment/fail`,
          });
          
          // 토스페이먼츠는 리다이렉트되므로 이 코드는 실행되지 않음
        } catch (error) {
          console.error("토스페이먼츠 결제 오류:", error);
          if (onFail) {
            onFail(
              "PAYMENT_ERROR",
              error instanceof Error ? error.message : "알 수 없는 오류"
            );
          }
        }
      } else {
        // 시뮬레이션 모드로 결제 처리
        setTimeout(() => {
          if (onSuccess) {
            onSuccess("SIMULATED_PAYMENT_KEY", orderId, amount);
          }
          setIsProcessing(false);
        }, 2000);
      }
    } catch (error) {
      console.error("결제 오류:", error);
      toast({
        variant: "destructive",
        title: "결제 오류",
        description: "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
      if (onFail) {
        onFail(
          "PAYMENT_ERROR",
          error instanceof Error ? error.message : "알 수 없는 오류"
        );
      }
      setIsProcessing(false);
    }
  };

  // 토스페이먼츠 위젯이 로딩 중일 때 표시할 로딩 UI
  if (!tossPaymentsWidgets) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">결제 위젯 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 토스페이먼츠 위젯 */}
      <div className="space-y-4">
        {paymentMethodElement}
        {agreementElement}
      </div>

      {/* 결제하기 버튼 */}
      <Button
        className="w-full"
        size="lg"
        onClick={handlePayment}
        disabled={isProcessing || !agreedRequiredTerms}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            결제 처리 중...
          </>
        ) : (
          <>결제하기 ({amount.toLocaleString()}원)</>
        )}
      </Button>
    </div>
  );
};

export default TossPaymentWidget;
