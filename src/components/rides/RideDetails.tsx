import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RideDetailsProps {
  ride: {
    id: string;
    date: string;
    time: string;
    from: string;
    to: string;
    status: string;
  };
  onBack: () => void;
  onCancel?: (ride: any) => void;
}

const RideDetails = ({ ride, onBack, onCancel }: RideDetailsProps) => {
  // 결제 정보 샘플 데이터 추가
  const paymentInfo = {
    amount: 15000,
    method: "카드",
    cardNumber: "****-****-****-1234",
    paymentDate: new Date(ride.date).toLocaleDateString("ko-KR"),
  };

  // 취소 가능 여부 확인 (예정된 일정만 취소 가능)
  const canCancel = ride.status === "scheduled";

  // 취소 위약금 정보 계산
  const calculatePenaltyInfo = () => {
    if (!canCancel) return { penaltyInfo: "", penaltyAmount: 0 };

    const rideDateTime = new Date(
      `${ride.date} ${ride.time.replace("오전", "AM").replace("오후", "PM")}`,
    );
    const currentTime = new Date();
    const hoursDifference = Math.floor(
      (rideDateTime - currentTime) / (1000 * 60 * 60),
    );

    let penaltyInfo = "";
    let penaltyAmount = 0;

    if (hoursDifference <= 4) {
      penaltyInfo = "4시간 이내 취소: 위약금 25,000원 발생";
      penaltyAmount = 25000;
    } else if (hoursDifference <= 24) {
      penaltyInfo = "24시간 이내 취소: 위약금 20,000원 발생";
      penaltyAmount = 20000;
    } else {
      penaltyInfo = "위약금 없음";
    }

    return { penaltyInfo, penaltyAmount };
  };

  const { penaltyInfo, penaltyAmount } = calculatePenaltyInfo();

  const handleCancel = () => {
    if (!canCancel || !onCancel) return;

    // 위약금 강조 다이얼로그 표시
    if (penaltyAmount > 0) {
      if (
        window.confirm(
          `⚠️ 위약금 발생 안내 ⚠️\n\n취소 시 ${penaltyAmount.toLocaleString()}원의 위약금이 발생합니다.\n\n${penaltyInfo}\n\n정말 취소하시겠습니까?`,
        )
      ) {
        window.alert(
          "예약이 취소되었습니다. 위약금은 등록된 결제 수단으로 청구됩니다.",
        );
        // 여기에 실제 취소 로직 추가
        onCancel(ride);
      }
    } else {
      if (
        window.confirm("예약을 취소하시겠습니까? 위약금이 발생하지 않습니다.")
      ) {
        window.alert("예약이 취소되었습니다.");
        // 여기에 실제 취소 로직 추가
        onCancel(ride);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pr-[4] pt-[4] pb-[24] px-0">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">이동 상세 정보</h1>
      </div>
      <Card className="mb-4 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">예약 정보</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">출발지</span>
              <span className="font-medium">{ride.from}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">도착지</span>
              <span className="font-medium">{ride.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">날짜</span>
              <span className="font-medium">
                {new Date(ride.date).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">시간</span>
              <span className="font-medium">{ride.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">상태</span>
              <span
                className={`font-medium ${ride.status === "completed" ? "text-green-600" : "text-blue-600"}`}
              >
                {ride.status === "completed" ? "완료됨" : "예정됨"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">예약번호</span>
              <span className="font-medium">{ride.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">결제 금액</span>
              <span className="font-medium">
                {paymentInfo.amount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span className="font-medium">{paymentInfo.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">카드 번호</span>
              <span className="font-medium">{paymentInfo.cardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제일</span>
              <span className="font-medium">{paymentInfo.paymentDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {canCancel && (
        <Card className="mb-4 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">취소 정책</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">
                • 4시간 이내 취소: 위약금 25,000원 발생
              </p>
              <p className="text-sm text-gray-600 mb-2">
                • 24시간 이내 취소: 위약금 20,000원 발생
              </p>
              <p className="text-sm text-gray-600 mb-4">
                • 24시간 이후 취소: 위약금 없음
              </p>
              <p className="text-sm font-medium text-red-500">{penaltyInfo}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {canCancel && (
        <div
          className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200"
          style={{ zIndex: 50 }}
        >
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleCancel}
          >
            예약 취소하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default RideDetails;
