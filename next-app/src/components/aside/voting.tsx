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
    <div className="w-full h-full z-100 flex flex-col gap-6">
      <div
        className={`p-6 bg-[#4D5061] h-5/6 rounded-2xl ${
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
            <div className="text-white absolute bottom-4 left-4 rounded-2xl flex justify-center items-center">
              {option.percentage}%
            </div>
            <h2 className="text-white font-semibold text-2xl">
              {option.content}
            </h2>
          </div>
        ))}
      </div>
      {admin ? (
        <div className="flex gap-6 w-full h-1/6">
          <button
            className="uppercase px-4 rounded-2xl cursor-pointer py-2 bg-[#30323D] text-[#E5ECF4] font-semibold disabled:opacity-35 disabled:cursor-not-allowed"
            onClick={endVoting}
            disabled={!canEnd}
          >
            End Voting
          </button>
          <div className="p-6 bg-[#4D5061] h-full w-full rounded-2xl flex justify-center items-center">
            <h2 className="text-[#E5ECF4] font-semibold text-2xl">
              {question}
            </h2>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-[#4D5061] h-1/6 rounded-2xl flex justify-center items-center">
          <h2 className="text-[#E5ECF4] font-semibold text-2xl">{question}</h2>
        </div>
      )}
    </div>
  );
}
