import React, { ReactNode } from "react";

interface SubPageLayoutProps {
  children: ReactNode;
}

const SubPageLayout = ({ children }: SubPageLayoutProps) => {
  return (
    <div className="flex flex-col items-center">
      {/* 모든 Sub Page에서 상단 바 제거 */}
      {children}
    </div>
  );
};

export default SubPageLayout;
