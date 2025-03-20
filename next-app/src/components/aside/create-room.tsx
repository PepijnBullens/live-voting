import { UserPen, Lock, School } from "lucide-react";

export default function CreateRoom({
  setSelectingRoom,
  joinRoom,
  _setRoom,
  setUsername,
  setPassword,
}: {
  setSelectingRoom: (state: boolean) => void;
  joinRoom: () => void;
  _setRoom: (state: string | null) => void;
  setUsername: (state: string | null) => void;
  setPassword: (state: string | null) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between gap-2">
      <div className="w-full flex grow flex-col">
        <h2 className="uppercase font-semibold border-b-1 text-[#E5ECF4] pb-1 mb-2">
          create a room
        </h2>
      </div>
      <div className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3">
        <input
          className="text-[#30323D] placeholder:text-[#797a81] placeholder:uppercase font-semibold p-3 text-sm outline-0"
          type="text"
          name="roomName"
          id="roomName"
          placeholder="enter a room name..."
          onChange={(e) => _setRoom(e.target.value)}
        />
        <School size={14} strokeWidth={3} color="#797a81" />
      </div>
      <div className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3">
        <input
          className="text-[#30323D] placeholder:text-[#797a81] placeholder:uppercase font-semibold p-3 text-sm outline-0"
          type="text"
          name="username"
          id="username"
          placeholder="enter a username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <UserPen size={14} strokeWidth={3} color="#797a81" />
      </div>
      <div className="bg-[#E5ECF4] rounded flex gap-1 justify-between items-center pr-3">
        <input
          className="text-[#30323D] placeholder:text-[#797a81] placeholder:uppercase font-semibold p-3 text-sm outline-0"
          type="password"
          name="password"
          id="password"
          placeholder="enter the password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <Lock size={14} strokeWidth={3} color="#797a81" />
      </div>
      <div
        className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
        onClick={joinRoom}
      >
        <button
          type="submit"
          className="uppercase text-[#E5ECF4] font-semibold p-3 text-sm outline-0 pointer-events-none"
        >
          create room
        </button>
      </div>
      <p className="w-full border-b-1 relative text-[#E5ECF4] my-4 after:content-['or'] after:uppercase after:font-semibold after:bg-[#4D5061] after:px-2 after:absolute after:left-1/2 after:top-1/2 after:-translate-1/2"></p>
      <div
        className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
        onClick={() => setSelectingRoom(true)}
      >
        <button
          type="submit"
          className="uppercase text-[#E5ECF4] font-semibold text-sm p-3 outline-0 pointer-events-none"
        >
          select room
        </button>
      </div>
    </div>
  );
}
