import { Vote } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex gap-2 items-center h-8">
      <div className="aspect-square w-6 bg-[#30323D] rounded-full flex justify-center items-center">
        <Vote size={12} strokeWidth={3} color="#E5ECF4" />
      </div>
      <h2 className="uppercase font-bold text-[#30323D] text-2xl">pollparty</h2>
    </div>
  );
}
