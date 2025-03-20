import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  exchangeCodeForToken,
  getKakaoUserProfile,
  checkUserExists,
  registerNewUser,
} from "@/lib/kakaoAuth";

const KakaoCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>("인증 코드 확인 중...");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const processKakaoLogin = async () => {
      try {
        // Step 2: Retrieve the authorization code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("Authorization code not found");
        }

        console.log("Received Kakao authorization code:", code);

        // Step 3: Exchange the code for an access token
        setStatus("액세스 토큰 발급 중...");
        const tokenResponse = await exchangeCodeForToken(code);

        // Step 4: Fetch user profile with the access token
        setStatus("사용자 정보 가져오는 중...");
        const kakaoUserProfile = await getKakaoUserProfile(
          tokenResponse.access_token,
        );

        // Step 5: Check if user exists in our database
        setStatus("사용자 확인 중...");
        const { exists, userData: existingUser } = await checkUserExists(
          kakaoUserProfile.id,
        );

        let finalUserData;

        if (exists && existingUser) {
          // User already exists, use existing data
          finalUserData = existingUser;
          console.log("Existing user found:", finalUserData);
        } else {
          // Step 6: Register new user
          setStatus("신규 사용자 등록 중...");
          finalUserData = await registerNewUser(kakaoUserProfile);
          console.log("New user registered:", finalUserData);
        }

        // Login the user and store session
        login(finalUserData);

        // Step 7: Redirect to dashboard after successful login
        setStatus("로그인 완료! 리디렉션 중...");
        navigate("/dashboard");
      } catch (err) {
        console.error("Kakao login error:", err);
        setError("카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        setIsLoading(false);
      }
    };

    processKakaoLogin();
  }, [location, login, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate("/auth")}
          className="text-blue-600 hover:underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-16 h-16 border-4 border-t-[#FEE500] border-b-[#FEE500] border-l-gray-200 border-r-gray-200 rounded-full animate-spin mb-6"></div>
      <div className="text-lg font-medium mb-2">로그인 중...</div>
      <div className="text-sm text-gray-500 mb-4">{status}</div>
      <div className="text-xs text-gray-400">잠시만 기다려주세요.</div>
    </div>
  );
};

export default KakaoCallback;
