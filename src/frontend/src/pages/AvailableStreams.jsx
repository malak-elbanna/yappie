import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AvailableStreams() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/stream/active");
        const data = await res.json();
        setRooms(data.rooms);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎧 Available Streams</h2>
      <Link to="/start-stream">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          + Start a New Stream
        </button>
      </Link>

      {rooms.length === 0 ? (
        <p>No active streams at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {Object.keys(rooms).map((room) => (
            <li key={room} className="border p-4 rounded shadow flex justify-between items-center">
              <span className="font-medium">{room}</span>
              <Link
                to={`/stream/${room}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Join Stream
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
