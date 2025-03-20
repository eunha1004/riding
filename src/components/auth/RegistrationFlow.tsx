import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentVerificationCode, setParentVerificationCode] = useState("");
  const [parentCodeSent, setParentCodeSent] = useState(false);
  const [parentVerified, setParentVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendParentVerificationCode = () => {
    // Simulate sending verification code
    setParentCodeSent(true);
    // In a real app, you would send a verification code to the phone number
    alert(
      "부모님 휴대폰으로 인증번호가 전송되었습니다. (실제로는 SMS로 전송됩니다)",
    );
  };

  const verifyParentCode = () => {
    // Simulate verification
    if (parentVerificationCode.length === 6) {
      setParentVerified(true);
      alert("부모님 휴대폰 인증이 완료되었습니다.");
      setStep(2); // Automatically move to confirmation step
    } else {
      alert("올바른 인증번호를 입력해주세요.");
    }
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      // In a real app, you would register the user with your backend
      setIsLoading(false);
      // Redirect to login page instead of home
      navigate("/auth");
      // Show success message
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-email">이메일</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">비밀번호</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-confirm-password">비밀번호 확인</Label>
            <Input
              id="reg-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent-phone">부모님 휴대폰 번호</Label>
            <div className="flex space-x-2">
              <Input
                id="parent-phone"
                type="tel"
                placeholder="010-0000-0000"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                required
              />
              <Button
                type="button"
                onClick={sendParentVerificationCode}
                disabled={parentCodeSent}
                className="whitespace-nowrap"
              >
                {parentCodeSent ? "전송됨" : "인증번호 전송"}
              </Button>
            </div>
          </div>

          {parentCodeSent && (
            <div className="space-y-2">
              <Label htmlFor="parent-verification-code">인증번호</Label>
              <div className="flex space-x-2">
                <Input
                  id="parent-verification-code"
                  type="text"
                  placeholder="6자리 인증번호"
                  value={parentVerificationCode}
                  onChange={(e) => setParentVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <Button
                  type="button"
                  onClick={verifyParentCode}
                  className="whitespace-nowrap"
                  disabled={parentVerified}
                >
                  {parentVerified ? "인증완료" : "인증 확인"}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                부모님 휴대폰으로 전송된 6자리 인증번호를 입력해주세요.
              </p>
            </div>
          )}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleRegistration} className="space-y-4">
          <div className="p-4 bg-green-50 rounded-md mb-4">
            <p className="text-green-700 text-sm">
              휴대폰 인증이 완료되었습니다.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-700">
              입력하신 정보로 회원가입을 진행하시겠습니까?
            </p>
            <ul className="text-sm text-slate-600 space-y-1 pl-5 list-disc">
              <li>이메일: {email}</li>
              <li>부모님 휴대폰 번호: {parentPhone}</li>
            </ul>
          </div>

          <div className="pt-2 flex space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              이전
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "처리 중..." : "회원가입 완료"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
