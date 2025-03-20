import React from "react";

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const TabsNavigation = ({
  activeTab,
  onTabChange,
  tabs,
}: TabsNavigationProps) => {
  return (
    <div className="flex w-full overflow-x-auto pb-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap mr-2 ${activeTab === tab.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
