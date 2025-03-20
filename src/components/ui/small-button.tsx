import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export interface SmallButtonProps extends Omit<ButtonProps, "size"> {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const SmallButton = React.forwardRef<HTMLButtonElement, SmallButtonProps>(
  (
    {
      className,
      label,
      leftIcon = <Plus className="w-4 h-4" />,
      rightIcon = <Plus className="w-4 h-4" />,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "w-[85px] h-[36px] px-3 py-2.5 rounded-lg gap-1 flex items-center justify-between",
          className,
        )}
        {...props}
      >
        {leftIcon}
        <span className="text-sm font-medium">{label}</span>
        {rightIcon}
      </Button>
    );
  },
);

SmallButton.displayName = "SmallButton";

export { SmallButton };
