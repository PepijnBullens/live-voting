import { useEffect } from "react";

interface Vote {
  id: string;
}

interface Answer {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
}

export function UI({
  answers,
  question,
  vote,
}: {
  answers: Answer[];
  question: string | null;
  vote: (id: string) => void;
}) {
  return (
    <>
      <div>
        {answers?.map((answer) => (
          <div key={answer.id} onClick={() => vote(answer.id)}>
            {answer.content}
            {answer.percentage}
          </div>
        ))}
      </div>
      <p>{question}</p>
    </>
  );
}

export default function Started({
  answers,
  question,
  vote,
  admin,
  endVoting,
  canEnd,
}: {
  answers: Answer[];
  question: string | null;
  vote: (id: string) => void;
  admin: boolean;
  endVoting: () => void;
  canEnd: boolean;
}) {
  return admin ? (
    <>
      <UI answers={answers} question={question} vote={vote} />
      <button onClick={endVoting} disabled={!canEnd}>
        End Voting
      </button>
    </>
  ) : (
    <UI answers={answers} question={question} vote={vote} />
  );
}
