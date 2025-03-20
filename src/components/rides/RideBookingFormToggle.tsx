import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AntRideBookingForm from "./AntRideBookingForm";
import { ConfigProvider } from "antd";
import koKR from "antd/lib/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";

// Configure dayjs to use Korean locale
dayjs.locale("ko");

interface RideBookingFormToggleProps {
  // Add any props if needed
}

const RideBookingFormToggle: React.FC<RideBookingFormToggleProps> = () => {
  const [activeTab, setActiveTab] = useState("shadcn");

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
        <CardHeader>
          <CardTitle className="text-center">라이드 예약 폼</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shadcn">ShadCN UI</TabsTrigger>
              <TabsTrigger value="antd">Ant Design</TabsTrigger>
            </TabsList>
            <TabsContent value="shadcn" className="mt-4">
              <ShadcnRideBookingForm />
            </TabsContent>
            <TabsContent value="antd" className="mt-4">
              <ConfigProvider locale={koKR}>
                <AntRideBookingForm />
              </ConfigProvider>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ShadcnRideBookingForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">아이 이름</label>
        <input
          className="w-full p-2 border rounded-md"
          placeholder="아이 이름을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">출발 위치</label>
        <select className="w-full p-2 border rounded-md" required>
          <option value="">출발 위치 선택</option>
          <option value="home">집</option>
          <option value="school">학교</option>
          <option value="gym">체육관</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">도착 위치</label>
        <select className="w-full p-2 border rounded-md" required>
          <option value="">도착 위치 선택</option>
          <option value="home">집</option>
          <option value="school">학교</option>
          <option value="gym">체육관</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">날짜 및 시간</label>
        <input type="date" className="w-full p-2 border rounded-md" required />
        <input
          type="time"
          className="w-full p-2 border rounded-md mt-2"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        라이드 예약하기
      </Button>
    </form>
  );
};

export default RideBookingFormToggle;
