import { ChevronDown, User } from "lucide-react";
import MainLayout from "@/layouts/main-layout";
import Voting from "@/components/aside/voting";
import { useState } from "react";

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
  members,
  kick,
  leaveRoom,
  room,
}: {
  options: Option[];
  question: string | null;
  vote: (id: string) => void;
  admin: boolean;
  endVoting: () => void;
  canEnd: boolean;
  members: Member[] | null;
  kick: (id: string) => void;
  leaveRoom: () => void;
  room: string | null;
}) {
  const [showMembers, setShowMembers] = useState(false);

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  return (
    <MainLayout>
      <Voting
        options={options}
        question={question}
        vote={vote}
        endVoting={endVoting}
        canEnd={canEnd}
        admin={admin}
      />
      <div className="h-full flex justify-end items-end">
        <div className="bg-[#4D5061] w-1/4 max-w-[332px] min-w-[400px] rounded-2xl p-6 z-100">
          <div className={`mb-8 ${showMembers ? "" : "hidden"}`}>
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
