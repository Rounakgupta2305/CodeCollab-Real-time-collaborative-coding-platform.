import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const codeRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      // Listen for new clients joining the chatroom
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          // this insure that new user connected message do not display to that user itself
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          // also send the code to sync
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`roomIs is copied`);
    } catch (error) {
      console.log(error);
      toast.error("unable to copy the room Id");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  return (
    <div className="container-fluid h-screen ">
      <div className="flex h-full">

        {/* Left Side */}
        <div className=" text-white flex flex-col h-full shadow-md p-4 border-r-2 lg:w-1/4">
          
          <div className="flex justify-center">
            <img src="/images/logo.png" alt="Logo" className="w-32"/>
          </div>
          
          <div className="text-center mt-4 text-2xl">
            CodeCollab
          </div>

          <hr className="my-5" />

          <div className="flex flex-col flex-grow overflow-auto px-5">
            <div className="text-center text-lg">
              Members
            </div>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div> 

          <div className="mt-auto">
            <hr className="my-5" />
            <div className="flex flex-col gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg" onClick={copyRoomId}>
                Copy Room ID
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg" onClick={leaveRoom}>
                Leave Room
              </button>
            </div>
          </div>

        </div>

        {/* Right side */}
        <div className="w-10/12 text-white flex flex-col h-full">
          <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=> codeRef.current=code}/> 
        </div>

      </div>
    </div>
  );
}

export default EditorPage;
