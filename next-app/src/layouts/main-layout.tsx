import Logo from "@/components/logo";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <div className="z-0 flex absolute top-0 right-0 w-72 -translate-y-1/3 translate-x-1/3 aspect-square bg-[#F25757] rounded-full"></div>
      <div className="z-0 flex absolute bottom-0 left-0 w-[42rem] translate-y-1/3 -translate-x-1/3 aspect-square bg-[#69DC9E] rounded-full"></div>
      <div className="z-0 flex absolute bottom-0 right-0 w-[38rem] translate-y-2/5 translate-x-2/7 aspect-square bg-[#E8C547] rounded-full"></div>
      <div className="w-full h-full p-8 pt-[6rem] z-100 flex gap-8">
        {children}
      </div>
    </div>
  );
}
