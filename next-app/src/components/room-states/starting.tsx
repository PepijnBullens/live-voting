import { CircleHelp, Copy, Check, CirclePlus, CircleX } from "lucide-react";
import MainLayout from "@/layouts/main-layout";
import Aside from "@/components/aside/aside";
import { useState, useEffect, useRef } from "react";

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
  leaveRoom,
  password,
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
  leaveRoom: () => void;
  password: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const answersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (answersRef.current) {
        setIsOverflowing(
          answersRef.current.scrollHeight > answersRef.current.clientHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [answers]);

  const copy = () => {
    navigator.clipboard.writeText(password || "");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <Aside>
        {admin ? (
          <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-2 overflow-hidden">
              <h2 className="uppercase font-semibold border-b-1 text-[#E5ECF4] pb-1 mb-2">
                set up room
              </h2>
              {password !== null && password !== "" && (
                <div
                  className="bg-[#30323D] rounded flex gap-1 justify-between items-center pr-3 cursor-pointer"
                  onClick={copy}
                >
                  <p className="text-[#E5ECF4] uppercase font-semibold p-3 text-sm pointer-events-none">
                    copy password
                  </p>
                  {copied ? (
                    <Check size={14} strokeWidth={3} color="#E5ECF4" />
                  ) : (
                    <Copy size={14} strokeWidth={3} color="#E5ECF4" />
                  )}
                </div>
              )}
              <div className="bg-[#30323D] rounded flex gap-1 justify-between items-center pr-3">
                <input
                  className="text-[#E5ECF4] placeholder:text-[#797a81] placeholder:uppercase font-semibold p-3 text-sm outline-0"
                  placeholder="enter an option..."
                  value={newAnswer || ""}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
                <CirclePlus
                  size={14}
                  strokeWidth={3}
                  color="#E5ECF4"
                  onClick={createNewAnswer}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2 flex-grow overflow-hidden relative">
                <div
                  ref={answersRef}
                  className={`w-full h-full overflow-auto flex flex-col gap-2 ${
                    isOverflowing ? "pr-1" : ""
                  }`}
                >
                  {answers.length > 0 &&
                    answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3"
                      >
                        <p className="text-[#30323D] font-semibold p-3 text-sm">
                          {answer.content}
                        </p>
                        <CircleX
                          size={14}
                          strokeWidth={3}
                          color="#30323D"
                          className="cursor-pointer"
                          onClick={() => removeAnswer(answer.id)}
                        />
                      </div>
                    ))}
                </div>
                {isOverflowing && (
                  <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#4D5061] to-transparent pointer-events-none"></div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3">
                <input
                  className="text-[#30323D] placeholder:text-[#797a81] placeholder:uppercase font-semibold p-3 text-sm outline-0"
                  type="text"
                  name="question"
                  id="question"
                  placeholder="enter a question..."
                  onChange={(e) => updateQuestion(e.target.value)}
                />
                <CircleHelp size={14} strokeWidth={3} color="#797a81" />
              </div>
              <div
                className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
                onClick={startRoom}
              >
                <button
                  type="submit"
                  className="uppercase text-[#E5ECF4] font-semibold text-sm p-3 outline-0 pointer-events-none"
                >
                  start room
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-end gap-2">
            <h2 className="uppercase font-semibold border-b-1 text-[#E5ECF4] pb-1 mb-2">
              setting up room
            </h2>
            <h2 className="uppercase font-semibold text-[#E5ECF4] w-full h-full flex justify-center items-center">
              Wait for admin
            </h2>
            <div>
              <h3 className="text-[#E5ECF4] font-semibold text-sm text-ellipsis overflow-hidden text-nowrap">
                {question || "..."}
              </h3>
            </div>
            <p className="w-full border-b-1 relative text-[#E5ECF4] mb-2 my-1"></p>
            <div
              className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
              onClick={leaveRoom}
            >
              <button
                type="submit"
                className="uppercase text-[#E5ECF4] font-semibold text-sm p-3 outline-0 pointer-events-none"
              >
                leave room
              </button>
            </div>
          </div>
        )}
      </Aside>
      <div>test</div>
    </MainLayout>
  );

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
