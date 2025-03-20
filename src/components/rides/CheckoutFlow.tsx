import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface CheckoutFlowProps {
  totalAmount?: number;
}

const CheckoutFlow = ({ totalAmount = 215800 }: CheckoutFlowProps) => {
  const [paymentStep, setPaymentStep] = useState("summary");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const handlePayment = () => {
    // 결제 처리 시뮬레이션
    setPaymentStep("confirmation");
    setPaymentStatus("success");
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-y-auto max-h-[90vh] no-scrollbar">
      <h2 className="text-xl font-bold mb-4">결제</h2>

      <Tabs value={paymentStep} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger
            value="summary"
            disabled={paymentStep !== "summary"}
            className="text-xs"
          >
            주문 요약
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            disabled={paymentStep !== "payment"}
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

        <TabsContent value="summary">
          <Card className="shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
            <CardHeader>
              <CardTitle className="text-base">주문 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">이동 정보</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>이동 유형:</span>
                      <span>정기 이동 (주 5회)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>기간:</span>
                      <span>2023년 6월 15일 ~ 7월 15일</span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 이동 횟수:</span>
                      <span>20회</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">경로 정보</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>경로 1:</span>
                      <span>집 → 학교 (오전 7:30)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>경로 2:</span>
                      <span>학교 → 집 (오후 3:30)</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">비용 정보</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>10회권 요금:</span>
                      <span>₩180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>추가 1회권 요금:</span>
                      <span>₩36,000</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>정기 이용 할인:</span>
                      <span>-₩0</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t text-sm">
                      <span>총 비용:</span>
                      <span>₩{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full text-xs"
                  onClick={handleProceedToPayment}
                >
                  결제 진행하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
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
                  <label className="text-xs font-medium">
                    카드 소유자 이름
                  </label>
                  <div className="p-2 border rounded-md text-sm">김지연</div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between font-bold mb-4">
                    <span>결제 금액:</span>
                    <span>₩{totalAmount.toLocaleString()}</span>
                  </div>
                  <Button className="w-full text-xs" onClick={handlePayment}>
                    ₩{totalAmount.toLocaleString()} 결제하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmation">
          <Card className="shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                {paymentStatus === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    결제 완료
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    결제 실패
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStatus === "success" ? (
                <div className="space-y-4 text-center">
                  <div className="py-6">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      결제가 완료되었습니다
                    </h3>
                    <p className="text-sm text-gray-500">
                      예약 확인 이메일이 등록된 이메일 주소로 발송되었습니다.
                    </p>
                  </div>

                  <div className="border rounded-md p-3 text-left">
                    <h3 className="font-medium text-sm mb-2">예약 정보</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>예약 번호:</span>
                        <span>KR-2023-06542</span>
                      </div>
                      <div className="flex justify-between">
                        <span>결제 금액:</span>
                        <span>₩{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>결제 일시:</span>
                        <span>{new Date().toLocaleString("ko-KR")}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full text-xs">
                    대시보드로 돌아가기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="py-6">
                    <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      결제에 실패했습니다
                    </h3>
                    <p className="text-sm text-gray-500">
                      카드 정보를 확인하고 다시 시도해주세요.
                    </p>
                  </div>

                  <Button
                    className="w-full text-xs"
                    onClick={() => setPaymentStep("payment")}
                  >
                    다시 시도하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckoutFlow;
