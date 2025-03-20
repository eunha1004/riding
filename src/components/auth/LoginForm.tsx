import { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import KakaoLogin from "./KakaoLogin";
import { Separator } from "../ui/separator";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginStart = () => {
    setIsLoading(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <KakaoLogin onLoginStart={handleLoginStart} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/auth/phone-login")}
        >
          휴대폰 번호로 로그인
        </Button>
      </div>

      <div className="text-center text-sm text-slate-500 mt-6">
        <p>
          대치라이드를 처음 이용하시나요?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600"
            onClick={() => navigate("/auth/register")}
          >
            회원가입
          </Button>
        </p>
      </div>
    </div>
  );
}
