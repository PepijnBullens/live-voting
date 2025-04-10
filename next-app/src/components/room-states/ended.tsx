import MainLayout from "@/layouts/main-layout";

interface Vote {
  id: string;
}

interface Option {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
}

export default function Ended({
  result,
  leaveRoom,
  draw,
}: {
  result: Option | null;
  leaveRoom: () => void;
  draw: boolean;
}) {
  return (
    <MainLayout>
      <div className="w-screen h-[calc(100vh-128px-64px)] flex justify-center items-center">
        <div className="bg-[#4D5061] z-100 p-8 rounded-xl flex flex-col gap-8">
          {draw ? (
            <h2 className="text-white font-semibold text-xl px-4 flex-grow flex justify-center items-center gap-2">
              <span className="text-[#4D5061] font-bold bg-[#E5ECF4] px-2 py-1 rounded">
                {result?.content}
              </span>{" "}
              won with {result?.percentage}% of the votes!
            </h2>
          ) : (
            <h2 className="text-white font-semibold text-xl px-4 flex-grow flex justify-center items-center gap-2">
              <span className="text-[#4D5061] font-bold bg-[#E5ECF4] px-2 py-1 rounded">
                {result?.content}
              </span>{" "}
              won with {result?.percentage}% of the votes!
            </h2>
          )}
          <button
            className="[font-size:_clamp(0.8rem,1.2vw,1rem)] w-full py-4 uppercase rounded-lg cursor-pointer bg-[#E5ECF4] text-[#4D5061] font-semibold disabled:opacity-10 disabled:cursor-not-allowed"
            onClick={leaveRoom}
          >
            Leave
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
