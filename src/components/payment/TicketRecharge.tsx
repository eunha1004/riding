import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info, CreditCard, Plus, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuantityControl from "./QuantityControl";

interface TicketRechargeProps {
  onSelectTicket?: (
    ticketType: string,
    price: number,
    quantity?: number,
  ) => void;
  apiTicketData?:
    | {
        bonus_ticket_count: number;
        ticket_count: number;
        ticket_price: number;
      }[]
    | null;
}

const TicketRecharge = ({
  onSelectTicket = () => {},
  apiTicketData = null,
}: TicketRechargeProps) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);

  // Generate tickets based on API data if available, otherwise use default values
  const tickets =
    apiTicketData && apiTicketData.length > 0
      ? apiTicketData.map((ticket) => {
          // Create different ticket types based on the ticket_count from API
          const ticketCount = ticket.ticket_count;

          if (ticketCount === 1) {
            // Single ticket
            return {
              id: String(ticketCount),
              name: "1회권",
              price: ticket.ticket_price,
              rides: ticketCount,
              bonus: ticket.bonus_ticket_count,
              pricePerRide: ticket.ticket_price,
              popular: false,
            };
          } else if (ticketCount === 10) {
            // 10-pack ticket
            return {
              id: String(ticketCount),
              name: "10회권",
              price: ticket.ticket_price * ticketCount,
              rides: ticketCount,
              bonus: ticket.bonus_ticket_count,
              pricePerRide: Math.round(
                (ticket.ticket_price * ticketCount) /
                  (ticketCount + ticket.bonus_ticket_count),
              ),
              popular: true,
            };
          } else {
            // 30-pack ticket or any other ticket type
            return {
              id: String(ticketCount),
              name: `${ticketCount}회권`,
              price: ticket.ticket_price * ticketCount,
              rides: ticketCount,
              bonus: ticket.bonus_ticket_count,
              pricePerRide: Math.round(
                (ticket.ticket_price * ticketCount) /
                  (ticketCount + ticket.bonus_ticket_count),
              ),
              popular: ticketCount === 30,
            };
          }
        })
      : [
          {
            id: "single",
            name: "1회권",
            price: 18000,
            rides: 1,
            bonus: 0,
            pricePerRide: 18000,
            popular: false,
          },
          {
            id: "ten",
            name: "10회권",
            price: 180000,
            rides: 10,
            bonus: 1,
            pricePerRide: 16364,
            popular: true,
          },
          {
            id: "thirty",
            name: "30회권",
            price: 540000,
            rides: 30,
            bonus: 4,
            pricePerRide: 15882,
            popular: false,
          },
        ];

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicket(ticketId);
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      onSelectTicket(
        ticket.name,
        ticket.price * ticketQuantity,
        ticketQuantity,
      );
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setTicketQuantity(newQuantity);

    if (selectedTicket) {
      const ticket = tickets.find((t) => t.id === selectedTicket);
      if (ticket) {
        onSelectTicket(ticket.name, ticket.price * newQuantity, newQuantity);
      }
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedTicket) return;
    const ticket = tickets.find((t) => t.id === selectedTicket);
    if (ticket) {
      onSelectTicket(
        ticket.name,
        ticket.price * ticketQuantity,
        ticketQuantity,
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden">
      <h2 className="text-xl font-bold mb-4">이용권 충전</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`border rounded-xl p-4 relative cursor-pointer transition-all bg-white ${selectedTicket === ticket.id ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-border hover:border-primary/50"}`}
              onClick={() => handleSelectTicket(ticket.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold">{ticket.name}</h3>
                    {ticket.bonus > 0 && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        +{ticket.bonus}회 추가 제공
                      </span>
                    )}
                    {ticket.popular && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        인기
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    ₩
                    {(
                      ticket.price *
                      (selectedTicket === ticket.id ? ticketQuantity : 1)
                    ).toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <span>
                      {(ticket.rides + ticket.bonus) *
                        (selectedTicket === ticket.id ? ticketQuantity : 1)}
                      회 이용 가능 (회당{" "}
                      {Math.round(
                        ticket.price / (ticket.rides + ticket.bonus),
                      ).toLocaleString()}
                      원)
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            기본{" "}
                            {ticket.rides *
                              (selectedTicket === ticket.id
                                ? ticketQuantity
                                : 1)}
                            회 + 추가{" "}
                            {ticket.bonus *
                              (selectedTicket === ticket.id
                                ? ticketQuantity
                                : 1)}
                            회
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedTicket === ticket.id ? "bg-primary text-primary-foreground" : "border border-gray-300"}`}
                >
                  {selectedTicket === ticket.id && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </div>
              {ticket.bonus > 0 && (
                <div className="mt-3 bg-green-50 p-2 rounded-md text-xs text-green-800">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">추가 혜택:</span>{" "}
                      {ticket.bonus *
                        (selectedTicket === ticket.id ? ticketQuantity : 1)}
                      회 무료 이용권이 추가로 제공됩니다. (총{" "}
                      {(ticket.rides + ticket.bonus) *
                        (selectedTicket === ticket.id ? ticketQuantity : 1)}
                      회)
                    </div>
                  </div>
                </div>
              )}
              {selectedTicket === ticket.id && (
                <div className="mt-3">
                  <QuantityControl
                    quantity={ticketQuantity}
                    onQuantityChange={handleQuantityChange}
                    minQuantity={1}
                    maxQuantity={10}
                  />
                </div>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">회당 가격:</span>{" "}
                  <span className="text-primary font-bold">
                    ₩{ticket.pricePerRide.toLocaleString()}
                  </span>
                </div>
                {ticket.id !== "single" && (
                  <div className="text-sm">
                    <span className="font-medium">할인율:</span>{" "}
                    <span className="text-green-600 font-bold">
                      {Math.round(
                        (((apiTicketData && apiTicketData.length > 0
                          ? apiTicketData[0].ticket_price
                          : 18000) -
                          ticket.pricePerRide) /
                          (apiTicketData && apiTicketData.length > 0
                            ? apiTicketData[0].ticket_price
                            : 18000)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted p-4 rounded-lg mt-6">
          <h3 className="font-medium mb-2">이용권 정책 안내</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
              <span>
                10회권 구매 시 1회 추가 제공됩니다 (총 11회), 30회권 구매 시 4회
                추가 제공됩니다 (총 34회)
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
              <span>이용권은 구매일로부터 90일간 유효합니다.</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
              <span>
                이동 시간이 1시간을 초과하는 경우 일정 등록이 불가합니다.
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
              <span>
                장소 및 시작 시간 등록 시 자동으로 예상 이동 시간이 계산됩니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicketRecharge;
