import React from "react";
import { Button } from "@/components/ui/button";

interface TicketStatusProps {
  used?: number;
  remaining?: number;
  expiryDate?: string;
  onRecharge?: () => void;
}

const TicketStatus = ({
  used = 3,
  remaining = 8,
  expiryDate = new Date(
    new Date().setDate(new Date().getDate() + 60),
  ).toLocaleDateString("ko-KR"),
  onRecharge,
}: TicketStatusProps) => {
  const totalTickets = 11; // 10회권 + 1회 보너스

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      {/* 이용권 제목 */}
      <h2 className="text-lg font-semibold">이용권 현황</h2>

      {/* 이용권 정보 */}
      <div className="mt-2 flex justify-between text-sm">
        <span>10회권 (11회 이용 가능)</span>
        <span className="text-[#E54141] font-medium">
          남은 회수: {remaining}회
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mt-2">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(used / totalTickets) * 100}%`,
            background: "linear-gradient(to right, #2B2E3B, #1A1D2A)", // 다크 그라데이션 적용
          }}
        ></div>
      </div>

      {/* 사용 횟수 & 만료일 */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>사용: {used}회</span>
        <span>만료일: {expiryDate}</span>
      </div>

      {/* 추가 안내 (그레이 컬러) */}
      <div className="mt-3 p-2 text-xs text-gray-500 bg-gray-100 rounded-md">
        <p>이용권은 구매일로부터 90일간 유효합니다.</p>
        <p>이동 시간이 1시간을 초과하는 경우 일정 등록 불가</p>
      </div>

      {/* 이용권 충전 버튼 */}
      <Button
        className="w-full h-12 bg-[#1A1D2A] text-white font-medium rounded-lg mt-4 hover:bg-[#252A3B] transition-colors"
        onClick={onRecharge}
      >
        이용권 충전하기
      </Button>
    </div>
  );
};

export default TicketStatus;
