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

export function UI({
  options,
  question,
  vote,
}: {
  options: Option[];
  question: string | null;
  vote: (id: string) => void;
}) {
  return (
    <>
      <div>
        {options &&
          options.length > 0 &&
          options.map((option) => (
            <div key={option.id} onClick={() => vote(option.id)}>
              {option.content}
              {option.percentage}
            </div>
          ))}
      </div>
      <p>{question}</p>
    </>
  );
}

export default function Started({
  options,
  question,
  vote,
  admin,
  endVoting,
  canEnd,
}: {
  options: Option[];
  question: string | null;
  vote: (id: string) => void;
  admin: boolean;
  endVoting: () => void;
  canEnd: boolean;
}) {
  return admin ? (
    <>
      <UI options={options} question={question} vote={vote} />
      <button onClick={endVoting} disabled={!canEnd}>
        End Voting
      </button>
    </>
  ) : (
    <UI options={options} question={question} vote={vote} />
  );
}
