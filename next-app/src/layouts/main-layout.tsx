import Logo from "@/components/logo";
import { ToastContainer } from "react-toastify";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen relative overflow-x-hidden">
      <div className="absolute top-8 left-8 z-100">
        <Logo />
      </div>
      <div className="z-0 flex fixed top-0 right-0 w-72 md:opacity-100 opacity-20 -translate-y-1/3 translate-x-1/3 aspect-square bg-[#F25757] rounded-full"></div>
      <div className="z-0 flex fixed bottom-0 left-0 w-[42rem] md:opacity-100 opacity-80 translate-y-1/3 -translate-x-1/3 aspect-square bg-[#69DC9E] rounded-full"></div>
      <div className="z-0 flex fixed bottom-0 right-0 w-[38rem] md:opacity-100 opacity-90 translate-y-2/5 translate-x-2/7 aspect-square bg-[#E8C547] rounded-full"></div>

      <div className="w-full min-h-full p-4 md:p-8 pt-32 md:pt-32 z-100 flex gap-6 md:flex-row justify-between md:justify-start flex-col">
        {children}
      </div>
    </div>
  );
}
