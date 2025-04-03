import {
  CircleHelp,
  Copy,
  Check,
  CirclePlus,
  CircleX,
  ChevronDown,
  User,
} from "lucide-react";
import MainLayout from "@/layouts/main-layout";
import Aside from "@/components/aside/aside";
import { useState, useEffect, useRef } from "react";

interface Vote {
  id: string;
}

interface Option {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
}

interface Member {
  id: string;
  username: string;
}

export default function Starting({
  question,
  updateQuestion,
  options,
  removeOption,
  newOption,
  setNewOption,
  createNewOption,
  startRoom,
  admin,
  leaveRoom,
  password,
  room,
  members,
  kick,
}: {
  question: string | null;
  updateQuestion: (question: string) => void;
  options: Option[];
  removeOption: (id: string) => void;
  newOption: string;
  setNewOption: (id: string) => void;
  createNewOption: () => void;
  startRoom: () => void;
  admin: boolean;
  leaveRoom: () => void;
  password: string | null;
  room: string | null;
  members: Member[] | null;
  kick: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (optionsRef.current) {
        setIsOverflowing(
          optionsRef.current.scrollHeight > optionsRef.current.clientHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [options]);

  const copy = () => {
    navigator.clipboard.writeText(password || "");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const toggleMembers = () => {
    setShowMembers(!showMembers);
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
                  value={newOption || ""}
                  onChange={(e) => setNewOption(e.target.value)}
                />
                <CirclePlus
                  size={14}
                  strokeWidth={3}
                  color="#E5ECF4"
                  onClick={createNewOption}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2 flex-grow overflow-hidden relative">
                <div
                  ref={optionsRef}
                  className={`w-full h-full overflow-auto flex flex-col gap-2 ${
                    isOverflowing ? "pr-1" : ""
                  }`}
                >
                  {options &&
                    options.length > 0 &&
                    options.map((option) => (
                      <div
                        key={option.id}
                        className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3"
                      >
                        <p className="text-[#30323D] font-semibold p-3 text-sm">
                          {option.content}
                        </p>
                        <CircleX
                          size={14}
                          strokeWidth={3}
                          color="#30323D"
                          className="cursor-pointer"
                          onClick={() => removeOption(option.id)}
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
      <div className="w-full h-full flex justify-end items-end">
        <div className="bg-[#4D5061] w-1/4 max-w-[332px] min-w-[290px] rounded-2xl p-6 z-100">
          <div className={`min-h-[400px] ${showMembers ? "" : "hidden"}`}>
            <ul className="flex flex-col gap-2">
              {members &&
                members.map((member) => (
                  <li
                    key={member.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-2 items-center">
                      <User color="#E5ECF4" strokeWidth={2.5} />
                      <h2 className="text-[#E5ECF4] font-semibold">
                        {member.username}
                      </h2>
                    </div>
                    {admin ? (
                      <h2
                        onClick={() => kick(member.id)}
                        className="uppercase px-4 rounded cursor-pointer py-2 bg-[#30323D] text-[#E5ECF4] font-semibold"
                      >
                        kick
                      </h2>
                    ) : null}
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2
                className="uppercase text-sm text-[#E5ECF4] font-semibold hover:underline cursor-pointer"
                onClick={leaveRoom}
              >
                leave room
              </h2>
              <h3 className="uppercase text-xs text-[#E5ECF4] font-semibold opacity-50">
                {room}
              </h3>
            </div>
            <ChevronDown
              color="#E5ECF4"
              className={`cursor-pointer transition-all ${
                showMembers ? "" : "rotate-180"
              }`}
              onClick={toggleMembers}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
