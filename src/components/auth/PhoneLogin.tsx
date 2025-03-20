import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ArrowLeft } from "lucide-react";

const PhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const sendVerificationCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    // Simulate sending verification code
    setCodeSent(true);
    // In a real app, you would send a verification code to the phone number
    alert("인증번호가 전송되었습니다. (실제로는 SMS로 전송됩니다)");
  };

  const verifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("올바른 인증번호를 입력해주세요.");
      return;
    }

    setIsVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      setIsLoading(true);

      // Simulate login process
      setTimeout(() => {
        // In a real app, you would validate the verification code with your backend
        const userData = {
          id: "phone_" + phoneNumber.replace(/[^0-9]/g, ""),
          name: "사용자",
          phoneNumber: phoneNumber,
          provider: "phone",
        };

        login(userData);
        setIsLoading(false);
        navigate("/");
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/auth")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">휴대폰 번호로 로그인</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone-number">휴대폰 번호</Label>
        <div className="flex space-x-2">
          <Input
            id="phone-number"
            type="tel"
            placeholder="010-0000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={codeSent}
            required
          />
          <Button
            type="button"
            onClick={sendVerificationCode}
            disabled={codeSent && !isVerifying}
          >
            {codeSent ? "재전송" : "인증번호 전송"}
          </Button>
        </div>
      </div>

      {codeSent && (
        <div className="space-y-2">
          <Label htmlFor="verification-code">인증번호</Label>
          <div className="flex space-x-2">
            <Input
              id="verification-code"
              type="text"
              placeholder="6자리 인증번호"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              required
            />
            <Button
              type="button"
              onClick={verifyCode}
              disabled={isVerifying || isLoading}
            >
              {isVerifying ? "확인 중..." : "확인"}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            휴대폰으로 전송된 6자리 인증번호를 입력해주세요.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-pulse text-lg font-medium">로그인 중...</div>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
        </div>
      )}
    </div>
  );
};

export default PhoneLogin;
