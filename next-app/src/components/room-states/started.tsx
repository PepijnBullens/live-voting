import MainLayout from "@/layouts/main-layout";
import Voting from "@/components/aside/voting";
import Members from "@/components/members";
import ChatComponent from "@/components/chat";

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

interface ChatType {
  id: string;
  username: string;
  userid: string;
  content: string;
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
  currentVote,
  sendChat,
  chats,
  socketId,
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
  currentVote: Vote | null;
  sendChat: (message: string) => void;
  chats: ChatType[] | null;
  socketId: string | null;
}) {
  return (
    <MainLayout>
      <Voting
        options={options}
        question={question}
        vote={vote}
        endVoting={endVoting}
        canEnd={canEnd}
        admin={admin}
        currentVote={currentVote}
      />

      <div className="flex justify-end flex-col order-2 gap-4 max-h-[calc(100vh-128px-32px)]">
        <ChatComponent chats={chats} sendChat={sendChat} socketId={socketId} />
        <Members
          members={members}
          admin={admin}
          leaveRoom={leaveRoom}
          room={room}
          kick={kick}
        />
      </div>
    </MainLayout>
  );
}
