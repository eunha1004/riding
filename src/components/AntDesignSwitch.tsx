import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AntDesignSwitchProps {
  onToggle?: (isAntDesign: boolean) => void;
}

const AntDesignSwitch = ({ onToggle = () => {} }: AntDesignSwitchProps) => {
  const [isAntDesign, setIsAntDesign] = useState(false);

  useEffect(() => {
    // Check if there's a saved preference in localStorage
    const savedPreference = localStorage.getItem("useAntDesign");
    if (savedPreference) {
      setIsAntDesign(savedPreference === "true");
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsAntDesign(checked);
    localStorage.setItem("useAntDesign", checked.toString());
    onToggle(checked);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-white p-2 rounded-md shadow-md">
      <Switch
        id="ant-design-mode"
        checked={isAntDesign}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="ant-design-mode" className="text-xs cursor-pointer">
        {isAntDesign ? "Ant Design" : "Shadcn UI"}
      </Label>
    </div>
  );
};

export default AntDesignSwitch;
