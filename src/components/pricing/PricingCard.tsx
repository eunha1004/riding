import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  onSelectPlan?: (plan: string) => void;
}

const PricingCard = ({ onSelectPlan = () => {} }: PricingCardProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually",
  );

  return (
    <div className="w-full h-full bg-background">
      <div className="space-y-5 px-4 py-8 md:px-8 md:py-12">
        <div className="container flex space-x-2">
          <div className="overflow-hidden no-scrollbar">
            <div className="flex justify-start space-x-6 items-center overflow-x-auto no-scrollbar">
              <button
                className={`font-semibold whitespace-nowrap text-base ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"} hover:text-gray-600 transition-colors duration-300`}
                onClick={() => setBillingCycle("monthly")}
              >
                월간 결제
              </button>
              <button
                className={`font-semibold whitespace-nowrap text-base ${billingCycle === "annually" ? "text-gray-900" : "text-gray-500"} hover:text-gray-600 transition-colors duration-300`}
                onClick={() => setBillingCycle("annually")}
              >
                연간 결제
              </button>
            </div>
          </div>
          {billingCycle === "annually" && (
            <button className="text-primary font-semibold text-base">
              (2개월 무료)
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 기본 요금제 */}
          <div className="rounded-[30px] md:rounded-[36px] bg-[#FAFAFA] overflow-hidden border-[1px] border-gray-200 p-8 relative">
            <div className="h-full">
              <div className="h-full z-10 relative">
                <div className="flex flex-col flex-1 justify-between h-full space-y-5">
                  <div className="flex justify-between flex-col">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 flex justify-between">
                      <span>기본</span>
                    </div>
                    <div className="pt-5 text-gray-500 font-medium text-base space-y-1">
                      <div className="flex items-center align-bottom">
                        <span className="pt-1.5">₩</span>
                        <div className="ml-1 mr-2 text-2xl md:text-3xl font-bold text-gray-900">
                          <span>
                            {billingCycle === "monthly" ? "18,000" : "15,000"}
                          </span>
                        </div>
                        <span className="pt-1.5">/ 월</span>
                      </div>
                      <div className="text-base">
                        {billingCycle === "annually"
                          ? "연간 결제 시"
                          : "월간 결제 시"}
                      </div>
                    </div>
                    <div className="">
                      <ul className="space-y-2 pt-8">
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>기본 이동 5회</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>최대 2개 위치 저장</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>기본 고객 지원</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      className="w-full hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl py-6"
                      onClick={() => onSelectPlan("basic")}
                    >
                      <span className="w-full font-semibold text-base">
                        기본 요금제 선택
                      </span>
                      <svg
                        className="inline-block h-6 ml-2"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 12.4999H21L14 19.4999M14 5.5L18 9.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 스탠다드 요금제 */}
          <div className="rounded-[30px] md:rounded-[36px] bg-[#FAFAFA] overflow-hidden border-[1px] border-gray-200 p-8 relative">
            <div className="h-full">
              <div className="h-full z-10 relative">
                <div className="flex flex-col flex-1 justify-between h-full space-y-5">
                  <div className="flex justify-between flex-col">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 flex justify-between">
                      <span>스탠다드</span>
                      <svg
                        className="h-6 w-6 animate-ping-slow text-primary"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M30.5 25C30.5 28.0376 28.0376 30.5 25 30.5C21.9624 30.5 19.5 28.0376 19.5 25C19.5 21.9624 21.9624 19.5 25 19.5C28.0376 19.5 30.5 21.9624 30.5 25Z"
                          stroke="currentColor"
                          strokeOpacity="0.7"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M38.75 25C38.75 32.5939 32.5939 38.75 25 38.75C17.4061 38.75 11.25 32.5939 11.25 25C11.25 17.4061 17.4061 11.25 25 11.25C32.5939 11.25 38.75 17.4061 38.75 25Z"
                          stroke="currentColor"
                          strokeOpacity="0.4"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M47.5 25C47.5 37.4264 37.4264 47.5 25 47.5C12.5736 47.5 2.5 37.4264 2.5 25C2.5 12.5736 12.5736 2.5 25 2.5C37.4264 2.5 47.5 12.5736 47.5 25Z"
                          stroke="currentColor"
                          strokeOpacity="0.1"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="pt-5 text-gray-500 font-medium text-base space-y-1">
                      <div className="flex items-center align-bottom">
                        <span className="pt-1.5">₩</span>
                        <div className="ml-1 mr-2 text-2xl md:text-3xl font-bold text-gray-900">
                          <span>
                            {billingCycle === "monthly" ? "180,000" : "160,000"}
                          </span>
                        </div>
                        <span className="pt-1.5">/ 월</span>
                      </div>
                      <div className="text-base">
                        {billingCycle === "annually"
                          ? "연간 결제 시"
                          : "월간 결제 시"}
                      </div>
                    </div>
                    <div className="">
                      <ul className="space-y-2 pt-8">
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>기본 요금제의 모든 기능</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>월 20회 이동</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>최대 5개 위치 저장</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      className="w-full hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl py-6"
                      onClick={() => onSelectPlan("standard")}
                    >
                      <span className="w-full font-semibold text-base">
                        스탠다드 요금제 선택
                      </span>
                      <svg
                        className="inline-block h-6 ml-2"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 12.4999H21L14 19.4999M14 5.5L18 9.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 프리미엄 요금제 */}
          <div className="rounded-[30px] md:rounded-[36px] bg-[#FAFAFA] overflow-hidden border-[1px] border-gray-200 p-8 relative">
            <div className="h-full">
              <div className="h-full z-10 relative">
                <div className="flex flex-col flex-1 justify-between h-full space-y-5">
                  <div className="flex justify-between flex-col">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 flex justify-between">
                      <span>프리미엄</span>
                    </div>
                    <div className="pt-5 text-gray-500 font-medium text-base space-y-1">
                      <div className="flex items-center align-bottom">
                        <span className="pt-1.5">₩</span>
                        <div className="ml-1 mr-2 text-2xl md:text-3xl font-bold text-gray-900">
                          <span>
                            {billingCycle === "monthly" ? "540,000" : "490,000"}
                          </span>
                        </div>
                        <span className="pt-1.5">/ 월</span>
                      </div>
                      <div className="text-base">
                        {billingCycle === "annually"
                          ? "연간 결제 시"
                          : "월간 결제 시"}
                      </div>
                    </div>
                    <div className="">
                      <ul className="space-y-2 pt-8">
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>스탠다드의 모든 기능</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>무제한 이동</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>최대 8개 위치 저장</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      className="w-full hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl py-6"
                      onClick={() => onSelectPlan("premium")}
                    >
                      <span className="w-full font-semibold text-base">
                        프리미엄 요금제 선택
                      </span>
                      <svg
                        className="inline-block h-6 ml-2"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 12.4999H21L14 19.4999M14 5.5L18 9.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 무료 체험 */}
          <div className="rounded-[30px] md:rounded-[36px] bg-[#FAFAFA] overflow-hidden border-[1px] border-gray-200 p-8 relative lg:col-span-2">
            <div className="h-full">
              <div className="h-full z-10 relative lg:flex lg:justify-between lg:w-full lg:pr-8 lg:items-center">
                <div className="flex flex-col flex-1 justify-between h-full space-y-5">
                  <div className="flex justify-between flex-col">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 flex justify-between">
                      <span>무료 체험</span>
                    </div>
                    <div className="pt-5 text-gray-500 font-medium text-base space-y-1">
                      <div className="flex items-center align-bottom">
                        <span className="pt-1.5">₩</span>
                        <div className="ml-1 mr-2 text-2xl md:text-3xl font-bold text-gray-900">
                          <span>0</span>
                        </div>
                        <span className="pt-1.5">/ 월</span>
                      </div>
                      <div className="text-base">7일 무료 체험</div>
                    </div>
                    <div className="lg:hidden">
                      <ul className="space-y-2 pt-8 lg:pt-0">
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>신용카드 필요 없음</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-black">
                          <Check className="h-4 w-4" />
                          <span>7일 무료 체험</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-gray-600">
                          <Check className="h-4 w-4" />
                          <span>최대 3회 이동</span>
                        </li>
                        <li className="flex items-center font-medium space-x-2 text-gray-600">
                          <Check className="h-4 w-4" />
                          <span>1개 위치 저장</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      className="w-full hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl py-6"
                      onClick={() => onSelectPlan("free")}
                    >
                      <span className="w-full font-semibold text-base">
                        무료 체험 시작하기
                      </span>
                      <svg
                        className="inline-block h-6 ml-2"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 12.4999H21L14 19.4999M14 5.5L18 9.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <ul className="space-y-2 pt-8 lg:pt-0">
                    <li className="flex items-center font-medium space-x-2 text-black">
                      <Check className="h-4 w-4" />
                      <span>신용카드 필요 없음</span>
                    </li>
                    <li className="flex items-center font-medium space-x-2 text-black">
                      <Check className="h-4 w-4" />
                      <span>7일 무료 체험</span>
                    </li>
                    <li className="flex items-center font-medium space-x-2 text-gray-600">
                      <Check className="h-4 w-4" />
                      <span>최대 3회 이동</span>
                    </li>
                    <li className="flex items-center font-medium space-x-2 text-gray-600">
                      <Check className="h-4 w-4" />
                      <span>1개 위치 저장</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 기업 요금제 */}
          <div className="rounded-[30px] md:rounded-[36px] bg-[#FAFAFA] overflow-hidden border-[1px] border-gray-200 p-8 relative sm:col-span-2 lg:col-span-1">
            <div className="h-full">
              <div className="flex flex-col justify-between h-full space-y-5">
                <div className="flex justify-between flex-col">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 flex justify-between">
                    <span>기업 요금제</span>
                  </div>
                  <div className="pt-5">
                    맞춤형 견적 및 온보딩 프로세스를 위해 문의해 주세요.
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl py-6"
                    onClick={() => onSelectPlan("enterprise")}
                  >
                    <span className="w-full font-semibold text-base">
                      영업팀 문의하기
                    </span>
                    <svg
                      className="inline-block h-6 ml-2"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 12.4999H21L14 19.4999M14 5.5L18 9.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
