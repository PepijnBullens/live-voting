interface Vote {
  id: string;
}

interface Option {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
}

export default function Voting({
  options,
  question,
  vote,
  endVoting,
  canEnd,
  admin,
}: {
  options: Option[];
  question: string | null;
  vote: (id: string) => void;
  endVoting: () => void;
  canEnd: boolean;
  admin: boolean;
}) {
  return (
    <div className="w-full flex-grow z-100 flex flex-col gap-4 justify-end">
      <div
        className={`p-6 flex-grow bg-[#4D5061] rounded-2xl ${
          options.length > 1 ? "grid grid-cols-1 lg:grid-cols-2" : ""
        } gap-4`}
      >
        {options.map((option, index) => (
          <div
            onClick={() => vote(option.id)}
            key={option.id}
            className={`${
              options.length === 1 ? "w-full h-full" : ""
            } cursor-pointer relative flex justify-center items-center text-white p-4 rounded-lg text-center font-semibold ${
              ["bg-[#E8C547]", "bg-[#F25757]", "bg-[#5C80BC]", "bg-[#69DC9E]"][
                index % 4
              ]
            }`}
          >
            <div className="text-white absolute md:bottom-4 lg:bottom-4 left-4 rounded-2xl flex justify-center items-center">
              {option.percentage}%
            </div>
            <h2 className="text-white font-semibold text-2xl [font-size:_clamp(1.2rem,2.2vw,1.8rem)]">
              {option.content}
            </h2>
          </div>
        ))}
      </div>
      {admin ? (
        <div className="flex flex-col justify-end md:mb-0 mb-8 lg:flex-row gap-4 w-full">
          <button
            className="[font-size:_clamp(0.8rem,1.2vw,1rem)] uppercase px-4 rounded-2xl cursor-pointer py-4 bg-[#4D5061] text-[#E5ECF4] font-semibold disabled:opacity-35 disabled:cursor-not-allowed"
            onClick={endVoting}
            disabled={!canEnd}
          >
            End Voting
          </button>
          <div className="p-6 bg-[#4D5061] w-full rounded-2xl flex justify-center items-center h-22">
            <h2 className="[font-size:_clamp(1rem,1.6vw,1.6rem)] text-[#E5ECF4] font-semibold text-2xl">
              {question}
            </h2>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-[#4D5061] rounded-2xl flex justify-center items-center h-22">
          <h2 className="text-[#E5ECF4] font-semibold text-2xl">{question}</h2>
        </div>
      )}
    </div>
  );
}
