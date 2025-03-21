import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
} from "lucide-react";
import TossPaymentWidget from "./TossPaymentWidget";
import { Button } from "@/components/ui/button";
import PaymentConfirmation from "./PaymentConfirmation";

interface BookingDetails {
  bookingType: "one-time" | "recurring";
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  selectedDays?: string[];
  routes: {
    id: string;
    name: string;
    pickup: string;
    dropoff: string;
    time: string;
  }[];
}

interface BookingPaymentFlowProps {
  bookingDetails: BookingDetails;
  onComplete?: () => void;
  onBack?: () => void;
}

const BookingPaymentFlow = ({
  bookingDetails,
  onComplete = () => {},
  onBack = () => {},
}: BookingPaymentFlowProps) => {
  const [paymentStep, setPaymentStep] = useState("summary");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [orderId, setOrderId] = useState(
    `RIDE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  );

  // 이용권 정책에 따른 가격 계산
  const calculatePrice = () => {
    const singlePrice = 18000; // 1회권 기본 가격
    const tenPackPrice = 180000; // 10회권 가격
    const thirtyPackPrice = 540000; // 30회권 가격
    let totalRides = 0;

    if (bookingDetails.bookingType === "one-time") {
      totalRides = bookingDetails.routes.length;
    } else {
      // 정기 이용의 경우 선택된 요일 수 * 주 수 * 경로 수
      const selectedDays = bookingDetails.selectedDays?.length || 0;
      const startDate = bookingDetails.startDate || new Date();
      const endDate = bookingDetails.endDate || new Date();
      const weeksDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      totalRides = selectedDays * weeksDiff * bookingDetails.routes.length;
    }

    // 이용권 정책 적용 (최적의 조합 계산)
    let price = 0;
    let discount = 0;
    let ticketType = "";
    let ticketDetails = [];

    if (totalRides <= 9) {
      // 9회 이하는 1회권으로 계산
      price = singlePrice * totalRides;
      ticketType = `1회권 x ${totalRides}개`;
      ticketDetails = [{ type: "1회권", count: totalRides }];
    } else {
      // 10회 이상은 10회권과 1회권 조합
      const tenPackCount = Math.floor(totalRides / 10);
      const remainingSingles = totalRides % 10;

      // 10회권 가격 계산
      price = tenPackCount * tenPackPrice;

      // 남은 회수에 대한 1회권 가격 계산
      if (remainingSingles > 0) {
        price += remainingSingles * singlePrice;
      }

      // 티켓 타입 문자열 생성
      const tenPackText = tenPackCount > 0 ? `10회권 x ${tenPackCount}개` : "";
      const singleText =
        remainingSingles > 0 ? `1회권 x ${remainingSingles}개` : "";

      if (tenPackCount > 0 && remainingSingles > 0) {
        ticketType = `${tenPackText} + ${singleText}`;
      } else if (tenPackCount > 0) {
        ticketType = tenPackText;
      } else {
        ticketType = singleText;
      }

      ticketDetails = [];
      if (tenPackCount > 0) {
        ticketDetails.push({ type: "10회권", count: tenPackCount });
      }
      if (remainingSingles > 0) {
        ticketDetails.push({ type: "1회권", count: remainingSingles });
      }
    }

    // 할인 계산 (1회권만 사용했을 때와의 차이)
    discount = singlePrice * totalRides - price;

    return {
      totalRides,
      price,
      discount,
      ticketType,
      ticketDetails,
      pricePerRide: Math.round(price / totalRides),
    };
  };

  const priceInfo = calculatePrice();

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
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

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBookingPeriodText = () => {
    if (bookingDetails.bookingType === "one-time") {
      return formatDate(bookingDetails.date);
    } else {
      return `${formatDate(bookingDetails.startDate)} ~ ${formatDate(bookingDetails.endDate)}`;
    }
  };

  const getSelectedDaysText = () => {
    if (bookingDetails.bookingType === "one-time") {
      return "일회성 이동";
    } else {
      return `매주 ${bookingDetails.selectedDays?.join(", ")} 요일`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden">
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
          <Card>
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
                      <span>{getSelectedDaysText()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>기간:</span>
                      <span>{getBookingPeriodText()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 이동 횟수:</span>
                      <span>{priceInfo.totalRides}회</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">경로 정보</h3>
                  <div className="space-y-2 text-xs">
                    {bookingDetails.routes.map((route, index) => (
                      <div key={route.id} className="flex justify-between">
                        <span>경로 {index + 1}:</span>
                        <span>
                          {route.pickup} → {route.dropoff} ({route.time})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">이용권 정보</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>최적 이용권 조합:</span>
                      <span>{priceInfo.ticketType}</span>
                    </div>
                    {priceInfo.ticketDetails &&
                      priceInfo.ticketDetails.map((ticket, index) => (
                        <div key={index} className="flex justify-between pl-2">
                          <span>
                            - {ticket.type} {ticket.count}개
                          </span>
                          <span>
                            {ticket.type === "1회권"
                              ? `₩${(18000 * ticket.count).toLocaleString()}`
                              : ticket.type === "10회권"
                                ? `₩${(180000 * ticket.count).toLocaleString()}`
                                : `₩${(540000 * ticket.count).toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                    <div className="flex justify-between">
                      <span>회당 가격:</span>
                      <span>₩{priceInfo.pricePerRide.toLocaleString()}</span>
                    </div>
                    {priceInfo.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>할인 금액:</span>
                        <span>-₩{priceInfo.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-1 border-t text-sm">
                      <span>총 비용:</span>
                      <span>₩{priceInfo.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={onBack}
                  >
                    뒤로 가기
                  </Button>
                  <Button
                    className="flex-1 text-xs"
                    onClick={handleProceedToPayment}
                  >
                    결제 진행하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                결제 정보 입력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">선택한 이용권:</span>
                    <div className="flex items-center">
                      <span>{priceInfo.ticketType}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>결제 금액:</span>
                    <span>₩{priceInfo.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-3">결제 방법 선택</h3>
                  <TossPaymentWidget
                    amount={priceInfo.price}
                    orderId={orderId}
                    orderName={`대치라이드 ${priceInfo.ticketType} 이용권`}
                    customerName="김지연"
                    onSuccess={handlePaymentSuccess}
                    onFail={handlePaymentFail}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmation">
          {paymentStatus === "success" ? (
            <PaymentConfirmation
              ticketType={priceInfo.ticketType}
              price={priceInfo.price}
              purchaseDate={new Date()}
              expiryDate={
                new Date(new Date().setDate(new Date().getDate() + 90))
              }
              onClose={onComplete}
            />
          ) : (
            <Card>
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
                      onClick={() => setPaymentStep("summary")}
                    >
                      주문 정보 확인
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

export default BookingPaymentFlow;
