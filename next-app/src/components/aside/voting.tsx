import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Vote {
  id: string;
}

interface Option {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
}

function AnimatedNumber({ value }: { value: number }) {
  let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  let display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export default function Voting({
  options,
  question,
  vote,
  endVoting,
  canEnd,
  admin,
  currentVote,
}: {
  options: Option[];
  question: string | null;
  vote: (id: string) => void;
  endVoting: () => void;
  canEnd: boolean;
  admin: boolean;
  currentVote: Vote | null;
}) {
  return (
    <div className="w-full flex-grow z-100 flex flex-col gap-4 justify-end max-h-[calc(100vh-128px-32px)]">
      <div
        className={`p-6 flex-grow bg-[#4D5061] rounded-2xl grid grid-cols-1 ${
          options.length > 1 ? "lg:grid-cols-2" : ""
        } gap-4`}
      >
        {options.map((option, index) => (
          <div
            onClick={() => vote(option.id)}
            key={option.id}
            className={`transition-all ${
              options.length == 1 ? "w-full h-full" : ""
            } cursor-pointer relative flex justify-center items-center text-white p-4 rounded-lg text-center font-semibold ${
              ["bg-[#E8C547]", "bg-[#F25757]", "bg-[#5C80BC]", "bg-[#69DC9E]"][
                index % 4
              ]
            } ${
              currentVote && option.id !== currentVote.id ? "opacity-40" : ""
            }`}
          >
            <div
              className={`text-white absolute ${
                options.length > 3 ? "md:bottom-4 lg:bottom-4" : "bottom-4"
              } left-4 rounded-2xl flex justify-center items-center`}
            >
              <AnimatedNumber value={option.percentage} />%
            </div>
            <h2 className="text-white font-semibold text-2xl [font-size:_clamp(1.2rem,2.2vw,1.8rem)]">
              {option.content}
            </h2>
          </div>
        ))}
      </div>
      {admin ? (
        <div className="flex flex-col justify-end md:mb-0 mb-8 lg:flex-row gap-4 w-full">
          <div className="p-6 bg-[#4D5061] w-full rounded-2xl flex flex-col justify-center items-center gap-8">
            <h2 className="[font-size:_clamp(1rem,1.6vw,1.6rem)] text-[#E5ECF4] font-semibold text-2xl">
              {question}
            </h2>
            <button
              className="[font-size:_clamp(0.8rem,1.2vw,1rem)] w-full py-4 uppercase rounded-lg cursor-pointer bg-[#E5ECF4] text-[#4D5061] font-semibold disabled:opacity-10 disabled:cursor-not-allowed"
              onClick={endVoting}
              disabled={!canEnd}
            >
              End Voting
            </button>
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
