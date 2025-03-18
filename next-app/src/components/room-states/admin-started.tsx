interface Answer {
  id: string;
  content: string;
  votes: number;
}

export default function AdminStarted({
  answers,
  question,
}: {
  answers: Answer[];
  question: string | null;
}) {
  return (
    <>
      <div>
        {answers?.map((answer) => (
          <div key={answer.id}>
            {answer.content}
            {answer.votes}
          </div>
        ))}
      </div>
      <p>{question}</p>
    </>
  );
}
