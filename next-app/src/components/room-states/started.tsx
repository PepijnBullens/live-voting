import MainLayout from "@/layouts/main-layout";
import Voting from "@/components/aside/voting";
import Members from "@/components/members";
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
  currentVote,
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
      <Members
        members={members}
        admin={admin}
        leaveRoom={leaveRoom}
        room={room}
        kick={kick}
      />
    </MainLayout>
  );
}
