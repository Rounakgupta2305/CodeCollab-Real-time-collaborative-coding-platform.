import {useState} from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Form() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room Id is generated");
  };
  const joinRoom = () => {
    
    if (roomId.length === 0 || username === 0) {
      toast.error("Please fill all details!!")
      return;
    } else if (roomId.length < 5) {
      toast.error("Room ID must be at least 5 characters long")
      return;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters long")
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("room is created");
  };
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-4 p-4 sm:w-[500px] sm:p-8">
      
      <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none text-white" placeholder="Room ID" onKeyUp={handleInputEnter}/>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none text-white" placeholder="Username" onKeyUp={handleInputEnter} />

      <button className="mt-2 w-full rounded-md bg-[#38E078] px-8 py-3 text-lg font-semibold text-white" onClick={joinRoom}>
        JOIN
      </button>      
      
      <button className="cursor-pointer select-none underline text-white" onClick={generateRoomId }>
        Generate Unique Room Id
      </button>

    </div>
  )
}

export default Form
