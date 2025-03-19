import { Delete } from "lucide-react";
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

export default function Starting({
  question,
  updateQuestion,
  answers,
  removeAnswer,
  newAnswer,
  setNewAnswer,
  createNewAnswer,
  startRoom,
  admin,
}: {
  question: string | null;
  updateQuestion: (question: string) => void;
  answers: Answer[];
  removeAnswer: (id: string) => void;
  newAnswer: string;
  setNewAnswer: (id: string) => void;
  createNewAnswer: () => void;
  startRoom: () => void;
  admin: boolean;
}) {
  return admin ? (
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
            {answer.percentage}
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
  ) : (
    <>
      <p>The admin is setting up the room.</p>
      <p>{question}</p>
    </>
  );
}
