import React from "react";
import { Button } from "@/components/ui/button";

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "fill";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  showIcons?: boolean;
}

export const CustomButton = ({
  label,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  fullWidth = true,
  showIcons = false,
}: CustomButtonProps) => {
  const baseClasses = fullWidth ? "w-[335px] h-[48px]" : "";

  if (variant === "primary") {
    return (
      <Button
        className={`${baseClasses} ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {label}
      </Button>
    );
  }

  if (variant === "fill") {
    return (
      <button
        className={`${baseClasses} ${className} flex items-center justify-center border border-[#EEEEEE] text-[#616161] font-medium rounded-lg px-4 py-2 shadow-sm bg-white hover:bg-gray-100 transition`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      className={`${baseClasses} ${className} flex items-center justify-center border border-[#EEEEEE] text-[#616161] font-medium rounded-lg px-4 py-2 shadow-sm bg-white hover:bg-gray-100 transition`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {label}
    </button>
  );
};

export default CustomButton;
