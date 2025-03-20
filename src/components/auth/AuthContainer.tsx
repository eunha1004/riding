import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import LoginForm from "./LoginForm";
import RegistrationFlow from "./RegistrationFlow";
import PasswordReset from "./PasswordReset";
import PhoneLogin from "./PhoneLogin";
import { Button } from "../ui/button";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AuthContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">대치 라이드</h1>
          <p className="mt-2 text-slate-600">
            대치 라이드를 이용하시려면 로그인 및 회원가입을 진행해 주세요
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6">
            <Routes>
              <Route path="reset-password" element={<PasswordReset />} />
              <Route path="phone-login" element={<PhoneLogin />} />
              <Route path="register" element={<RegistrationFlow />} />
              <Route
                path="*"
                element={
                  <>
                    <h2 className="text-xl font-semibold text-center mb-6">
                      로그인
                    </h2>
                    <LoginForm />
                  </>
                }
              />
            </Routes>
          </div>
        </Card>
      </div>
    </div>
  );
}
