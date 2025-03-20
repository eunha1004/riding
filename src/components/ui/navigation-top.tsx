import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface NavigationTopProps {
  title: string;
  onBack?: () => void;
}

const NavigationTop = ({ title, onBack }: NavigationTopProps) => {
  return (
    <div className="flex h-[56px] px-5 py-4 items-center gap-[127px] self-stretch bg-white">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-0 h-6 w-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </div>
  );
};

export default NavigationTop;
