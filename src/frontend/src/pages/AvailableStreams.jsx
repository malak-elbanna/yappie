import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../Stream";
import useAuth from "../hooks/useAuth";

export default function AvailableStreams() {
  const [rooms, setRooms] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    API.get("/stream/active")
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center pt-12 pb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg text-center">
          Join a Live Stream
        </h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
          Dive into real-time audio sessions with your community. Explore what’s streaming now.
        </p>
        <Link to="/start-stream">
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition">
            + Start a Stream
          </button>
        </Link>
      </div>

      <div className="container mx-auto px-6 py-10 relative z-10">
        {rooms.length === 0 ? (
          <p className="text-center text-gray-400 italic mt-20">No active streams at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Object.keys(rooms).map((room) => (
              <Link
                to={`/stream/${room}?role=${
                  rooms[room].broadcasterId === userId ? "broadcaster" : "listener"
                }&userId=${userId}`}
                key={room}
                className="group relative bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-pink-600 transition duration-300 p-4 flex flex-col items-center text-center hover:bg-opacity-60"
              >
                <div className="rounded-xl w-full h-40 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mb-4 shadow-inner">
                  <h3 className="text-2xl font-bold text-white">{room}</h3>
                  <p className="text-sm text-gray-400">👥 {rooms[room].participantCount} listeners</p>
                </div>
                <p className="text-sm text-green-400 mb-5">Live now</p>
                <button className="bg-pink-600 hover:bg-pink-400 text-white hover:text-black font-semibold px-4 py-1.5 rounded-full shadow transition">
                  Join Stream
                </button>
                <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-pink-600 transition-all duration-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
