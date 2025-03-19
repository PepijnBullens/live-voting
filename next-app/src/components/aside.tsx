import React from "react";

export default function Aside({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#4D5061] w-1/4 h-full max-w-[332px] min-w-[290px] rounded-2xl p-6 z-100">
      {children}
    </div>
  );
}
