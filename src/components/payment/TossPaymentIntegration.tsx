import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Building,
  Check,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";

// 토스페이먼츠 SDK 타입 정의
interface PaymentWidget {
  renderPaymentMethods: (
    selector: string,
    amount: { value: number },
    options?: any
  ) => void;
  renderAgreement: (selector: string) => void;
  requestPayment: (options: any) => Promise<any>;
}

interface TossPaymentProps {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  successUrl?: string;
  failUrl?: string;
  onSuccess?: (paymentKey: string, orderId: string, amount: number) => void;
  onFail?: (errorCode: string, errorMsg: string) => void;
}

const TossPaymentIntegration = ({
  amount,
  orderId,
  orderName,
  customerName = "사용자",
  successUrl = window.location.origin + "/payment/success",
  failUrl = window.location.origin + "/payment/fail",
  onSuccess,
  onFail,
}: TossPaymentProps) => {
  // 테스트용 클라이언트 키
  const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
  const { toast } = useToast();
  const paymentWidgetRef = useRef(null);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "card" | "transfer"
  >("card");
  const [selectedCard, setSelectedCard] = useState("samsung");
  const [selectedBank, setSelectedBank] = useState("woori");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardOptions, setShowCardOptions] = useState(false);
  const [showBankOptions, setShowBankOptions] = useState(false);
  const [showAgreements, setShowAgreements] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        setIsLoading(true);

        // 토스페이먼츠 SDK 동적 로드 시도
        if (typeof window !== "undefined") {
          // 이미 로드된 스크립트가 있는지 확인
          const existingScript = document.getElementById("toss-payments-sdk");
          if (!existingScript) {
            const script = document.createElement("script");
            script.id = "toss-payments-sdk";
            script.src = "https://js.tosspayments.com/v1/payment-widget";
            script.async = true;
            script.onload = async () => {
              try {
                if (window.PaymentWidget) {
                  // @ts-ignore - 전역 객체 접근
                  const paymentWidget =
                    await window.PaymentWidget.renderPaymentMethods(
                      "#payment-widget",
                      { clientKey: clientKey, customerKey: customerName },
                      { value: amount }
                    );

                  // @ts-ignore - 전역 객체 접근
                  window.PaymentWidget.renderAgreement("#agreement-widget");

                  paymentWidgetRef.current = paymentWidget;
                  setIsWidgetLoaded(true);
                  setIsLoading(false);
                } else {
                  throw new Error("PaymentWidget not found");
                }
              } catch (error) {
                console.error("토스페이먼츠 위젯 초기화 오류:", error);
                setIsWidgetLoaded(true);
                setIsLoading(false);
              }
            };

            script.onerror = () => {
              console.error("토스페이먼츠 SDK 로드 실패");
              toast({
                variant: "destructive",
                title: "결제 위젯 로드 오류",
                description:
                  "결제 위젯을 불러오는 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.",
              });
              setIsWidgetLoaded(true);
              setIsLoading(false);
            };

            document.head.appendChild(script);
          } else {
            // 이미 스크립트가 로드된 경우 시뮬레이션 모드로 전환
            setIsWidgetLoaded(true);
            setIsLoading(false);
          }
        } else {
          // SSR 환경에서는 시뮬레이션 모드로 전환
          setIsWidgetLoaded(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("결제 위젯 로드 오류:", error);
        toast({
          variant: "destructive",
          title: "결제 위젯 로드 오류",
          description:
            "결제 위젯을 불러오는 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.",
        });

        // 위젯 로드 실패 시 시뮬레이션 모드로 전환
        setIsWidgetLoaded(true);
        setIsLoading(false);
      }
    };

    fetchPaymentWidget();

    return () => {
      // 컴포넌트 언마운트 시 정리 작업
      paymentWidgetRef.current = null;
    };
  }, [amount, clientKey, customerName, toast]);

  const handlePayment = async () => {
    if (!agreementChecked) {
      toast({
        variant: "destructive",
        title: "결제 동의 필요",
        description: "결제 진행을 위해 필수 동의사항에 동의해주세요.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      toast({
        title: "결제 처리 중",
        description: "잠시만 기다려주세요...",
      });

      // 실제 환경에서는 토스페이먼츠 SDK를 사용하여 결제 처리
      // 시뮬레이션 환경에서는 타이머로 결제 성공 처리
      setTimeout(() => {
        if (onSuccess) {
          onSuccess("SIMULATED_PAYMENT_KEY", orderId, amount);
        }
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("결제 오류:", error);
      toast({
        variant: "destructive",
        title: "결제 오류",
        description: "결제 중 오류가 발생했습니다. 다시 시도해주세요.",
      });

      if (onFail) {
        onFail(
          "PAYMENT_ERROR",
          error instanceof Error ? error.message : "알 수 없는 오류"
        );
      }
      setIsProcessing(false);
    }
  };

  // 카드 정보
  const cards = [
    {
      id: "samsung",
      name: "삼성카드",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/card-logos/samsung.png",
    },
    {
      id: "shinhan",
      name: "신한카드",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/card-logos/shinhan.png",
    },
    {
      id: "kb",
      name: "KB국민",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/card-logos/kb.png",
    },
    {
      id: "hyundai",
      name: "현대카드",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/card-logos/hyundai.png",
    },
    {
      id: "lotte",
      name: "롯데카드",
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&q=80",
    },
    {
      id: "bc",
      name: "비씨카드",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80",
    },
  ];

  // 은행 정보
  const banks = [
    {
      id: "shinhan",
      name: "신한",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/shinhan.png",
    },
    {
      id: "jeonbuk",
      name: "전북",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/jeonbuk.png",
    },
    {
      id: "samsung",
      name: "삼성",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/samsung.png",
    },
    {
      id: "lotte",
      name: "롯데",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/lotte.png",
    },
    {
      id: "toss",
      name: "토스뱅크",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/toss.png",
    },
    {
      id: "hana",
      name: "하나",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/hana.png",
    },
    {
      id: "kookmin",
      name: "국민",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/kookmin.png",
    },
    {
      id: "woori",
      name: "우리",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/woori.png",
    },
    {
      id: "nonghyup",
      name: "농협",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/nonghyup.png",
    },
    {
      id: "kakaobank",
      name: "카카오뱅크",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/kakaobank.png",
    },
    {
      id: "more",
      name: "더보기",
      logo: "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/bank-logos/more.png",
    },
  ];

  // 선택된 카드/은행 정보 가져오기
  const getSelectedCard = () =>
    cards.find((card) => card.id === selectedCard) || cards[0];
  const getSelectedBank = () =>
    banks.find((bank) => bank.id === selectedBank) || banks[0];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 토스페이먼츠 스타일 결제 UI */}
      <Card className="overflow-hidden">
        {/* 결제 수단 선택 탭 */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              selectedPaymentMethod === "card"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedPaymentMethod("card")}
          >
            <div className="flex justify-center items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              카드
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              selectedPaymentMethod === "transfer"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedPaymentMethod("transfer")}
          >
            <div className="flex justify-center items-center">
              <Building className="h-4 w-4 mr-1" />
              계좌이체
            </div>
          </button>
        </div>

        {/* 결제 수단 상세 */}
        <div className="p-4">
          {selectedPaymentMethod === "card" && (
            <div className="space-y-4">
              <div className="relative">
                <div
                  className="flex items-center justify-between p-3 border rounded-md cursor-pointer"
                  onClick={() => setShowCardOptions(!showCardOptions)}
                >
                  <div className="flex items-center">
                    <img
                      src={getSelectedCard().logo}
                      alt={getSelectedCard().name}
                      className="h-6 w-auto mr-2"
                    />
                    <span className="text-sm font-medium">
                      {getSelectedCard().name}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                {showCardOptions && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto no-scrollbar">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedCard === card.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setSelectedCard(card.id);
                          setShowCardOptions(false);
                        }}
                      >
                        <img
                          src={card.logo}
                          alt={card.name}
                          className="h-6 w-auto mr-2"
                        />
                        <span className="text-sm">{card.name}</span>
                        {selectedCard === card.id && (
                          <Check className="h-4 w-4 ml-auto text-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">카드번호</span>
                  <span className="text-xs text-gray-500">
                    보안 암호화 적용
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    className="p-2 border rounded-md text-center text-sm"
                    placeholder="0000"
                    maxLength={4}
                    defaultValue="1234"
                  />
                  <input
                    type="text"
                    className="p-2 border rounded-md text-center text-sm"
                    placeholder="0000"
                    maxLength={4}
                    defaultValue="••••"
                  />
                  <input
                    type="text"
                    className="p-2 border rounded-md text-center text-sm"
                    placeholder="0000"
                    maxLength={4}
                    defaultValue="••••"
                  />
                  <input
                    type="text"
                    className="p-2 border rounded-md text-center text-sm"
                    placeholder="0000"
                    maxLength={4}
                    defaultValue="9876"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">유효기간</span>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="MM/YY"
                    defaultValue="12/25"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">CVC</span>
                    <Info className="h-3 w-3 ml-1 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="000"
                    defaultValue="123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">카드 비밀번호</span>
                <div className="flex items-center">
                  <input
                    type="password"
                    className="w-20 p-2 border rounded-md text-center text-sm"
                    placeholder="앞 2자리"
                    defaultValue="••"
                  />
                  <span className="mx-2 text-gray-400">••</span>
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === "transfer" && (
            <div className="space-y-4">
              <div className="relative">
                <div
                  className="flex items-center justify-between p-3 border rounded-md cursor-pointer"
                  onClick={() => setShowBankOptions(!showBankOptions)}
                >
                  <div className="flex items-center">
                    <img
                      src={getSelectedBank().logo}
                      alt={getSelectedBank().name}
                      className="h-6 w-auto mr-2"
                    />
                    <span className="text-sm font-medium">
                      {getSelectedBank().name}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                {showBankOptions && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto no-scrollbar">
                    {banks.map((bank) => (
                      <div
                        key={bank.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedBank === bank.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => {
                          setSelectedBank(bank.id);
                          setShowBankOptions(false);
                        }}
                      >
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="h-6 w-auto mr-2"
                        />
                        <span className="text-sm">{bank.name}</span>
                        {selectedBank === bank.id && (
                          <Check className="h-4 w-4 ml-auto text-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center text-sm text-gray-600">
                  <Info className="h-4 w-4 mr-2 text-gray-400" />
                  계좌이체 시 결제금액이 예금주명 "토스페이먼츠"로 이체됩니다.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 결제 동의 섹션 */}
        <div className="p-4 border-t">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowAgreements(!showAgreements)}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreement"
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
              />
              <label htmlFor="agreement" className="ml-2 text-sm font-medium">
                필수 약관 전체 동의
              </label>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                showAgreements ? "transform rotate-180" : ""
              }`}
            />
          </div>

          {showAgreements && (
            <div className="mt-3 pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  전자금융거래 이용약관
                </span>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  개인정보 수집 및 이용 동의
                </span>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  개인정보 제3자 제공 동의
                </span>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 결제 버튼 */}
      <Button
        className="w-full py-6 text-base font-medium"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            처리 중...
          </div>
        ) : (
          `${amount.toLocaleString()}원 결제하기`
        )}
      </Button>

      {/* 실제 토스페이먼츠 위젯 컨테이너 (숨김) */}
      <div id="payment-widget" className="hidden"></div>
      <div id="agreement-widget" className="hidden"></div>
    </div>
  );
};

export default TossPaymentIntegration;
