import { ChevronDown, User } from "lucide-react";
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

export default function Members({
  members,
  admin,
  leaveRoom,
  room,
  kick,
}: {
  members: Member[] | null;
  admin: boolean;
  leaveRoom: () => void;
  room: string | null;
  kick: (id: string) => void;
}) {
  const [showMembers, setShowMembers] = useState(false);

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  return (
    <div className="flex justify-end items-end order-2">
      <div
        className={`bg-[#4D5061] w-full md:w-1/4 md:max-w-[332px] md:min-w-[400px] rounded-2xl p-6 z-100 flex flex-col justify-center  items-center ${
          showMembers ? "" : "h-22"
        }`}
      >
        <div className={`mb-8 ${showMembers ? "" : "hidden"} w-full`}>
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
        <div className="flex justify-between items-center w-full">
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
  );
}
