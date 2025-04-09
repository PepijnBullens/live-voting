import { Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface ChatType {
  id: string;
  username: string;
  userid: string;
  content: string;
}

export default function Chat({
  chats,
  socketId,
  sendChat,
}: {
  chats: ChatType[] | null;
  socketId: string | null;
  sendChat: (message: string) => void;
}) {
  const [message, setMessage] = useState<string>("");

  const send = () => {
    if (message == "") return;
    sendChat(message);
    setMessage("");
  };

  const chatOwner = (isOwner: boolean, element = 0) => {
    return element === 0
      ? isOwner
        ? "ml-auto bg-[#5C80BC] -translate-x-[8px] rounded-tr-none after:right-0 after:top-0 after:translate-x-full after:border-r-[8px] after:border-l-transparent after:border-t-[10px] after:border-t-[#5C80BC] after:border-r-transparent"
        : "bg-[#E5ECF4] translate-x-[8px] rounded-tl-none after:left-0 after:top-0 after:-translate-x-full after:border-l-[8px] after:border-l-transparent after:border-t-[10px] after:border-t-[#E5ECF4] after:border-r-transparent"
      : element === 1
      ? isOwner
        ? "text-[#FFFFFF] opacity-50"
        : ""
      : isOwner
      ? "text-[#FFFFFF]"
      : "";
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatContainer2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (chatContainer2Ref.current) {
      chatContainer2Ref.current.scrollTop =
        chatContainer2Ref.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="w-full flex flex-col justify-between bg-[#4D5061] z-100 rounded-2xl p-6 gap-2 flex-grow overflow-hidden">
      <div
        ref={chatContainer2Ref}
        className="overflow-auto flex-grow max-h-[600px] md:max-h-none lg:max-h-none"
      >
        <h2 className="uppercase font-semibold border-b-1 text-[#E5ECF4] pb-1 mb-2">
          chat
        </h2>
        <div
          ref={chatContainerRef}
          className="overflow-auto flex-grow max-h-[600px] md:max-h-none lg:max-h-none"
        >
          {chats?.map((chat) => (
            <div
              key={chat.id}
              className={`
            ${chatOwner(socketId == chat.userid, 0)}
            mb-4 rounded flex flex-col p-2 w-3/4 relative after:content-[''] after:absolute min-h-[60px]`}
            >
              <p
                className={`${chatOwner(
                  socketId == chat.userid,
                  1
                )} text-[#4D5061] opacity-50 font-semibold text-sm`}
              >
                {socketId == chat.userid ? "you" : chat.username}
              </p>
              <h2
                className={`${chatOwner(
                  socketId == chat.userid,
                  2
                )} text-[#64687F] font-semibold`}
              >
                {chat.content}
              </h2>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3">
          <input
            className="text-[#30323D] placeholder:text-[#797a81] placeholder:uppercase font-semibold p-3 text-sm outline-0 w-full"
            type="text"
            name="message"
            id="message"
            placeholder="sent a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Send
            size={14}
            strokeWidth={3}
            color="#797a81"
            onClick={send}
            className="cursor-pointer"
          />
        </div>
        <div
          className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
          onClick={send}
        >
          <button
            type="submit"
            className="uppercase text-[#E5ECF4] font-semibold p-3 text-sm outline-0 pointer-events-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
