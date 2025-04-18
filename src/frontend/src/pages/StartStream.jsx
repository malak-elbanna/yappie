import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StartStream = () => {
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!roomID.trim()) return;
    navigate(`/stream/${roomID}`);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">🎙️ Start a Live Stream</h2>
      <input
        type="text"
        placeholder="Enter room ID (e.g., book-club-1)"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleStart}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Start Streaming
      </button>
    </div>
  );
};

export default StartStream;
