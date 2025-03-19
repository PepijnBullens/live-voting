interface Vote {
  id: string;
}

interface Answer {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
}

export default function Ended({
  result,
  draw,
}: {
  result: Answer | null;
  draw: boolean;
}) {
  return (
    <>
      <p>ended</p>
      <p>
        {draw
          ? `The voting ended in a draw. With the winner being randomly chosen as: ${result?.content}. With ${result?.percentage}% of the votes`
          : `The voting resulted in the winner: ${result?.content}. With ${result?.percentage}% of the votes.`}
      </p>
    </>
  );
}
