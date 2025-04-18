import React, { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth"; 
import { useParams } from "react-router-dom";

export default function LiveAudioStreaming() {
  const { roomId } = useParams();
  console.log("roomId:", roomId);  
  
  const { userId } = useAuth();
  const [isBroadcaster, setIsBroadcaster] = useState(false);
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const [status, setStatus] = useState("Disconnected");

  const getSocketUrl = () =>
    `ws://localhost:8080/stream/live/${roomId}?userId=${userId}`;    

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const startBroadcasting = async () => {
    if (!userId) return alert("User not authenticated.");

    socketRef.current = new WebSocket(getSocketUrl());
    socketRef.current.binaryType = "arraybuffer";

    socketRef.current.onopen = async () => {
      setStatus("Broadcasting...");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
          let s = Math.max(-1, Math.min(1, input[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(pcmData.buffer);
        }
      };

      socketRef.current.onclose = () => {
        processor.disconnect();
        source.disconnect();
        setStatus("Disconnected");
      };
    };
  };

  const startListening = () => {
    if (!userId) return alert("User not authenticated.");

    socketRef.current = new WebSocket(getSocketUrl());
    socketRef.current.binaryType = "arraybuffer";
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    socketRef.current.onopen = () => {
      setStatus("Listening...");
    };

    socketRef.current.onmessage = (e) => {
      const int16Array = new Int16Array(e.data);
      const float32Array = new Float32Array(int16Array.length);

      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 0x7FFF;
      }

      const buffer = audioContextRef.current.createBuffer(
        1,
        float32Array.length,
        audioContextRef.current.sampleRate
      );

      buffer.copyToChannel(float32Array, 0);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    };

    socketRef.current.onclose = () => {
      setStatus("Disconnected");
    };
  };

  const handleStart = () => {
    isBroadcaster ? startBroadcasting() : startListening();
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">🎙️ Live Audio Stream Tester</h2>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isBroadcaster}
          onChange={() => setIsBroadcaster(!isBroadcaster)}
        />
        I'm the broadcaster
      </label>

      <button
        onClick={handleStart}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start {isBroadcaster ? "Broadcasting" : "Listening"}
      </button>

      <p>Status: <strong>{status}</strong></p>
    </div>
  );
}
