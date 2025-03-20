import React, { useState } from "react";
import { Layout, ConfigProvider } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";
import AntDashboard from "./Dashboard";
import AntLocationManager from "./LocationManager";
import AntRideScheduler from "./RideScheduler";
import AntPaymentFlow from "./PaymentFlow";
import koKR from "antd/lib/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";

// Configure dayjs to use Korean locale
dayjs.locale("ko");

const AntDesignApp = () => {
  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <div className="ant-design-app">
        <AntDashboard />
      </div>
    </ConfigProvider>
  );
};

export default AntDesignApp;
