import { UserPen, Lock } from "lucide-react";

interface Room {
  id: string;
  name: string;
  hasPassword: boolean;
}

export default function SelectRoom({
  rooms,
  changeActiveRoom,
  activeRoom,
  setSelectingRoom,
  joinRoom,
  setUsername,
  setPassword,
}: {
  rooms: Room[];
  changeActiveRoom: (room: Room) => void;
  activeRoom: Room | null;
  setSelectingRoom: (state: boolean) => void;
  joinRoom: () => void;
  setUsername: (state: string | null) => void;
  setPassword: (state: string | null) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between gap-2">
      <div className="w-full flex grow flex-col">
        <h2 className="uppercase font-semibold border-b-1 text-[#E5ECF4] pb-1 mb-2">
          join a room
        </h2>
        <div className="relative w-full h-full">
          <div className="w-full h-full overflow-auto">
            {rooms &&
              rooms.length > 0 &&
              rooms.map((room) => (
                <div
                  className={`w-full h-8 flex gap-2 items-center py-1 rounded cursor-pointer ${
                    activeRoom?.id === room.id ? "bg-[#30323D] px-2" : ""
                  }`}
                  key={room.id}
                  onClick={() => changeActiveRoom(room)}
                >
                  <div
                    className={`h-4 aspect-square rounded-full  ${
                      room.hasPassword ? "bg-[#F25757]" : "bg-[#69DC9E]"
                    }`}
                  ></div>
                  <h3 className="uppercase font-semibold text-[#E5ECF4] overflow-ellipsis overflow-hidden">
                    {room.name}
                  </h3>
                </div>
              ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#4D5061] to-transparent pointer-events-none"></div>
        </div>
      </div>
      {activeRoom && (
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
      )}
      {activeRoom && activeRoom.hasPassword && (
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
      )}
      {rooms && rooms.length > 0 ? (
        <>
          <div
            className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
            onClick={activeRoom ? joinRoom : () => {}}
          >
            <button
              type="submit"
              className="uppercase text-[#E5ECF4] font-semibold p-3 text-sm outline-0 pointer-events-none"
            >
              {activeRoom ? "join room" : "select a room"}
            </button>
          </div>
          <p className="w-full border-b-1 relative text-[#E5ECF4] my-4 after:content-['or'] after:uppercase after:font-semibold after:bg-[#4D5061] after:px-2 after:absolute after:left-1/2 after:top-1/2 after:-translate-1/2"></p>
        </>
      ) : (
        <>
          <h2 className="uppercase font-semibold text-[#E5ECF4] w-full h-full flex justify-center items-center">
            No active rooms
          </h2>
          <p className="w-full border-b-1 relative text-[#E5ECF4] my-4"></p>
        </>
      )}
      <div
        className="bg-[#F25757] rounded flex gap-1 justify-center items-center cursor-pointer"
        onClick={() => setSelectingRoom(false)}
      >
        <button
          type="submit"
          className="uppercase text-[#E5ECF4] font-semibold text-sm p-3 outline-0 pointer-events-none"
        >
          create room
        </button>
      </div>
    </div>
  );
}
