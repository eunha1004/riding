import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface CostCalculatorProps {
  totalDistance?: number;
  totalRides?: number;
  isRecurring?: boolean;
  weeks?: number;
}

const CostCalculator = ({
  totalDistance = 45,
  totalRides = 10,
  isRecurring = true,
  weeks = 4,
}: CostCalculatorProps) => {
  // 간단한 가격 계산 로직
  const basePrice = 18000; // 기본 요금 (1회권 기준)
  const pricePerKm = 0; // km당 요금 (패키지 요금제로 변경)
  const recurringDiscount = 0.1; // 정기 이용 할인율

  const distancePrice = totalDistance * pricePerKm;
  const subtotal = basePrice * totalRides + distancePrice;
  const discount = isRecurring ? subtotal * recurringDiscount : 0;
  const total = subtotal - discount;

  return (
    <Card className="w-full max-w-md mx-auto overflow-y-auto max-h-[90vh] no-scrollbar">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">비용 계산</CardTitle>
        <Calculator className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>기본 요금 (x{totalRides}회)</span>
            <span>₩{(basePrice * totalRides).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>거리 요금 ({totalDistance}km)</span>
            <span>₩{distancePrice.toLocaleString()}</span>
          </div>
          {isRecurring && (
            <div className="flex justify-between items-center text-sm text-green-600">
              <span>정기 이용 할인 ({recurringDiscount * 100}%)</span>
              <span>-₩{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center font-bold">
              <span>총 비용</span>
              <span>₩{total.toLocaleString()}</span>
            </div>
            {isRecurring && (
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                <span>주당 비용 ({weeks}주)</span>
                <span>₩{Math.round(total / weeks).toLocaleString()}/주</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostCalculator;
