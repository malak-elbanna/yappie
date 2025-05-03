import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const StartStream = () => {
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();
  const { userId } = useAuth();

  const handleStart = () => {
    if (!roomID.trim()) return;
    navigate(`/stream/${roomID}?role=broadcaster&userId=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-700 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">🎙️ Start a Live Stream</h2>
        <input
          type="text"
          placeholder="Enter room ID (e.g., book-club-1)"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 mb-6 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={handleStart}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition"
        >
          🚀 Start Streaming
        </button>
      </div>
    </div>
  );
};

export default StartStream;