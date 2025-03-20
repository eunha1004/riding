import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getKakaoAuthUrl } from "@/lib/kakaoAuth";

interface KakaoLoginProps {
  onLoginStart?: () => void;
}

const KakaoLogin: React.FC<KakaoLoginProps> = ({ onLoginStart }) => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    if (onLoginStart) {
      onLoginStart();
    }
    // Redirect to Kakao's authorization page
    window.location.href = getKakaoAuthUrl();
  };

  return (
    <Button
      onClick={handleKakaoLogin}
      className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] hover:text-[#000000]/90 font-medium"
      style={{
        backgroundColor: "#FEE500",
        color: "#000000",
        border: "none",
        height: "45px",
      }}
    >
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
        alt="Kakao Logo"
        className="mr-2 h-5 w-5"
      />
      카카오 계정으로 로그인
    </Button>
  );
};

export default KakaoLogin;
