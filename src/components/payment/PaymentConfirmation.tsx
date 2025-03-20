import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock } from "lucide-react";

interface PaymentConfirmationProps {
  ticketType?: string;
  price?: number;
  purchaseDate?: Date;
  expiryDate?: Date;
  onClose?: () => void;
  quantity?: number;
}

const PaymentConfirmation = ({
  ticketType = "10회권",
  price = 163630,
  purchaseDate = new Date(),
  expiryDate = new Date(new Date().setDate(new Date().getDate() + 90)),
  onClose = () => {},
  quantity = 1,
}: PaymentConfirmationProps) => {
  // 추가 회수 계산
  const getBonus = () => {
    if (ticketType === "10회권") return 1 * quantity;
    if (ticketType === "30회권") return 4 * quantity;
    return 0;
  };

  // 총 이용 가능 회수 계산
  const getTotalRides = () => {
    if (ticketType === "1회권") return 1 * quantity;
    if (ticketType === "10회권") return 11 * quantity;
    if (ticketType === "30회권") return 34 * quantity;
    return 0;
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-transparent">
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">결제가 완료되었습니다</h2>
        <p className="text-muted-foreground mb-6">
          이용권이 성공적으로 충전되었습니다.
        </p>

        <Card className="bg-white shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">결제 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">이용권 종류</span>
                <span>
                  {ticketType} {quantity > 1 ? `(${quantity}개)` : ""}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">결제 금액</span>
                <span className="font-bold">₩{price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">이용 가능 횟수</span>
                <div className="text-right">
                  <span className="font-bold">{getTotalRides()}회</span>
                  {getBonus() > 0 && (
                    <div className="text-xs text-green-600">
                      (+{getBonus()}회 추가 제공)
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">구매일</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{purchaseDate.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">유효기간</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{expiryDate.toLocaleDateString()} 까지</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={onClose}>
            대시보드로 돌아가기
          </Button>
          <Button variant="outline" className="w-full">
            영수증 저장하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
