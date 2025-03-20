import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeSelectorProps {
  onSelectTime?: (time: string) => void;
  defaultTime?: string;
  label?: string;
  disabled?: boolean;
}

const TimeSelector = ({
  onSelectTime = () => {},
  defaultTime = "",
  label = "시간 선택",
  disabled = false,
}: TimeSelectorProps) => {
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [isOpen, setIsOpen] = useState(false);

  // 시간 범위 생성 (오전 6시 ~ 오후 10시, 30분 간격)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute of [0, 30]) {
        const period = hour < 12 ? "오전" : "오후";
        const displayHour = hour <= 12 ? hour : hour - 12;
        const timeString = `${period} ${displayHour}:${minute === 0 ? "00" : minute}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className="shadow-none">
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal text-sm h-10"
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime || label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="max-h-60 overflow-y-auto p-1 no-scrollbar">
          {timeOptions.map((time, index) => (
            <div
              key={index}
              className={`px-3 py-2 text-sm cursor-pointer rounded-md ${selectedTime === time ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => handleSelectTime(time)}
            >
              {time}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimeSelector;
