import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute, FaMicrophone, FaMicrophoneSlash, FaTimes } from "react-icons/fa";
export default function LiveAudioStreaming() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Disconnected");
  const [emojiQueue, setEmojiQueue] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");
  const userId = queryParams.get("userId");

  const getSocketUrl = () =>
    `ws://localhost:8080/stream/live/${roomId}?userId=${userId}&role=${role}`;

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (processorRef.current) processorRef.current.disconnect();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (emojiQueue.length > 0) {
      const timer = setTimeout(() => {
        setEmojiQueue((prev) => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emojiQueue]);

  useEffect(() => {
    if (status === "Disconnected") return;

    if (role === "broadcaster" && streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }

    if (role === "listener" && gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 1;
    }
  }, [isMuted, status, role]);

  const startBroadcasting = async () => {
    try {
      socketRef.current = new WebSocket(getSocketUrl());
      socketRef.current.binaryType = "arraybuffer";

      socketRef.current.onopen = async () => {
        setStatus("Broadcasting");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyzer = audioContext.createAnalyser();
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        
        source.connect(analyzer);
        analyzer.connect(processor);
        processor.connect(audioContext.destination);
        
        analyzer.fftSize = 256;
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        
        const updateAudioLevel = () => {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setAudioLevel(average / 256);
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        };
        
        updateAudioLevel();

        processor.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(pcmData.buffer);
          }
        };

        socketRef.current.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.type === "emoji") {
              setEmojiQueue((prev) => [...prev, { emoji: msg.emoji, id: Date.now() }]);
            }
          } catch (_) {}
        };

        socketRef.current.onclose = () => {
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          processor.disconnect();
          source.disconnect();
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          setStatus("Disconnected");
        };
      };
    } catch (error) {
      console.error("Error starting broadcast:", error);
      setStatus("Error: " + error.message);
    }
  };

  const startListening = () => {
    try {
      socketRef.current = new WebSocket(getSocketUrl());
      socketRef.current.binaryType = "arraybuffer";
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      const gainNode = audioContextRef.current.createGain();
      gainNode.connect(audioContextRef.current.destination);
      gainNodeRef.current = gainNode;
      
      gainNode.gain.value = isMuted ? 0 : 1;

      socketRef.current.onopen = () => {
        setStatus("Listening");
      };

      socketRef.current.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "emoji") {
            setEmojiQueue((prev) => [...prev, { emoji: msg.emoji, id: Date.now() }]);
            return;
          }
        } catch (_) {}

        const int16Array = new Int16Array(e.data);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 0x7FFF;
        }

        const buffer = audioContextRef.current.createBuffer(1, float32Array.length, audioContextRef.current.sampleRate);
        buffer.copyToChannel(float32Array, 0);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        
        source.connect(gainNodeRef.current);
        source.start();
        
        const average = float32Array.reduce((sum, val) => sum + Math.abs(val), 0) / float32Array.length;
        setAudioLevel(average);
      };

      socketRef.current.onclose = () => {
        setStatus("Disconnected");
        if (gainNodeRef.current) {
          gainNodeRef.current.disconnect();
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    } catch (error) {
      console.error("Error starting listening:", error);
      setStatus("Error: " + error.message);
    }
  };

  const sendEmoji = (emoji) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const emojiPayload = JSON.stringify({ type: "emoji", emoji });
      socketRef.current.send(emojiPayload);

      setEmojiQueue((prev) => [...prev, { emoji, id: Date.now() }]);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleStart = () => {
    if (!userId) return alert("User not authenticated.");
    if (role === "broadcaster") startBroadcasting();
    if (role === "listener") startListening();
  };

  const handleCloseStream = () => {
    if (socketRef.current) {
      socketRef.current.close();
      setStatus("Disconnected");
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate("/streams"); 
  };

  const emojis = [
    { symbol: "❤️", name: "Love" },
    { symbol: "😂", name: "Laugh" },
    { symbol: "🔥", name: "Fire" },
    { symbol: "👏", name: "Clap" },
    { symbol: "😢", name: "Sad"}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,0,255,0.1)_0,rgba(10,10,30,0)_50%)]"></div>
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-purple-600/0"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <div className="mb-8 flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mr-4">
            <span className="text-2xl">🎧</span>
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Live Audio Stream</h2>
        </div>

        {role ? (
          <div className="w-full backdrop-blur-lg bg-gray-900/70 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">

            <div className="h-24 w-full relative bg-gray-950 overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around">
                {[...Array(40)].map((_, i) => {
                  const height = audioLevel * (25 + Math.sin(i * 0.3) * 15) + 5;
                  return (
                    <div 
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-sm mx-px transform transition-all duration-75"
                      style={{ height: `${height}%` }}
                    ></div>
                  );
                })}
              </div>
              <div className="absolute inset-0 bg-gray-950/30 backdrop-blur-sm flex items-center justify-center">
                <div className="px-4 py-2 rounded-full bg-gray-900/80 border border-gray-700 shadow-lg flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${status === "Disconnected" ? "bg-red-500" : "bg-green-500"}`}></div>
                  <span className="text-sm font-medium">{status}</span>
                  {isMuted && (
                    <span className="ml-2 text-red-400 text-xs font-medium">(Muted)</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center bg-gray-800/50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-300 mb-1">
                    Room ID: <span className="text-white">{roomId}</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    You're the {role === "broadcaster" ? "broadcaster" : "listener"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {status === "Disconnected" ? (
                  <button
                    onClick={handleStart}
                    className={`w-full py-3 rounded-lg font-bold transition shadow-lg ${
                      role === "broadcaster"
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    }`}
                  >
                    {role === "broadcaster" ? "Start Broadcasting" : "Start Listening"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={toggleMute}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition border ${
                        isMuted 
                          ? "bg-red-900/50 hover:bg-red-800/70 border-red-700/50" 
                          : "bg-gray-800 hover:bg-gray-700 border-gray-700"
                      }`}
                    >
                      {isMuted ? (
                        <>
                          {role === "broadcaster" ? <FaMicrophoneSlash className="text-red-400" /> : <FaVolumeMute className="text-red-400" />}
                          <span>Unmute</span>
                        </>
                      ) : (
                        <>
                          {role === "broadcaster" ? <FaMicrophone className="text-green-400" /> : <FaVolumeUp className="text-green-400" />}
                          <span>Mute</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleCloseStream}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium bg-red-900/70 hover:bg-red-800 transition border border-red-800"
                    >
                      <FaTimes /> <span>End</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <div className="text-center mb-3 text-sm text-gray-400">Send Reaction</div>
                <div className="flex justify-center gap-4">
                  {emojis.map(({ symbol, name }) => (
                    <button
                      key={symbol}
                      onClick={() => sendEmoji(symbol)}
                      className="group relative"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-all transform group-hover:scale-110 border border-gray-700 shadow-lg">
                        <span className="text-2xl">{symbol}</span>
                      </div>
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full backdrop-blur-lg bg-gray-900/70 rounded-2xl shadow-2xl p-8 text-center">
            <div className="animate-pulse">
              <div className="inline-block w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 mb-4"></div>
              <p className="text-gray-400">Determining your role...</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {emojiQueue.map(({ emoji, id }) => (
          <span
            key={id}
            className="absolute text-4xl animate-float"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              top: "80%",
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
              transform: `rotate(${Math.random() * 40 - 20}deg)`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) rotate(0); opacity: 0; }
            10% { opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translateY(-300px) rotate(10deg); opacity: 0; }
          }
          .animate-float {
            animation: float ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
