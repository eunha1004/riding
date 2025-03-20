import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendVerificationCode = () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    // Simulate sending verification code
    setCodeSent(true);
    // In a real app, you would send a verification code to the email
    alert("이메일로 인증번호가 전송되었습니다. (실제로는 이메일로 전송됩니다)");
  };

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification
    if (verificationCode.length === 6) {
      setStep(2);
    } else {
      alert("올바른 인증번호를 입력해주세요.");
    }
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      // In a real app, you would reset the password with your backend
      setIsLoading(false);
      alert("비밀번호가 성공적으로 재설정되었습니다.");
      navigate("/auth");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <form onSubmit={verifyCode} className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">
            비밀번호 재설정
          </h2>

          <div className="space-y-2">
            <Label htmlFor="reset-email">이메일</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="button"
              className="w-full"
              onClick={sendVerificationCode}
            >
              {codeSent ? "인증번호 재전송" : "인증번호 전송"}
            </Button>
          </div>

          {codeSent && (
            <>
              <div className="space-y-2 mt-4">
                <Label htmlFor="verification-code">인증번호</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="6자리 인증번호"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  이메일로 전송된 6자리 인증번호를 입력해주세요.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full">
                  확인
                </Button>
              </div>
            </>
          )}

          <div className="text-center text-sm text-slate-500 mt-4">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate("/auth")}
            >
              로그인으로 돌아가기
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPassword} className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">
            새 비밀번호 설정
          </h2>

          <div className="space-y-2">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">비밀번호 확인</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "처리 중..." : "비밀번호 변경"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
