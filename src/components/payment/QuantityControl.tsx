import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantityControl = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 10,
}: QuantityControlProps) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex rounded-md p-2 justify-end items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleDecrease}
        disabled={quantity <= minQuantity}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="mx-4 font-bold">{quantity}개</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantityControl;
