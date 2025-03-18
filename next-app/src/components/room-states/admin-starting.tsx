import { Delete } from "lucide-react";

interface Answer {
  id: string;
  content: string;
  votes: number;
}

export default function AdminStarting({
  question,
  updateQuestion,
  answers,
  removeAnswer,
  newAnswer,
  setNewAnswer,
  createNewAnswer,
  startRoom,
}: {
  question: string | null;
  updateQuestion: (question: string) => void;
  answers: Answer[];
  removeAnswer: (id: string) => void;
  newAnswer: string;
  setNewAnswer: (id: string) => void;
  createNewAnswer: () => void;
  startRoom: () => void;
}) {
  return (
    <>
      <input
        type="text"
        name="question"
        id="question"
        value={question || ""}
        placeholder="question"
        onChange={(e) => updateQuestion(e.target.value)}
      />
      <div>
        {answers?.map((answer) => (
          <div key={answer.id}>
            {answer.content}
            {answer.votes}
            <Delete onClick={() => removeAnswer(answer.id)} />
          </div>
        ))}
      </div>
      <input
        type="text"
        name="newAnswer"
        id="newAnswer"
        value={newAnswer || ""}
        onChange={(e) => setNewAnswer(e.target.value)}
      />
      <button onClick={createNewAnswer}>New Answer</button>
      <button onClick={startRoom}>Start Game</button>
    </>
  );
}
