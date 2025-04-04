import React from "react";

export default function Aside({ children }: { children: React.ReactNode }) {
  return (
    <div className="order-2 md:order-1 bg-[#4D5061] w-full md:w-1/4 flex-grow flex flex-col md:max-w-[332px] md:min-w-[340px] rounded-2xl p-6 z-100">
      {children}
    </div>
  );
}
