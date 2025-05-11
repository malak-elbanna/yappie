import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function AudioHLS({ source }) {
  const audioRef = useRef();
  const hlsRef = useRef();
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const hls = new Hls({
      debug: true,
      maxMaxBufferLength: 20,
      backBufferLength: 10,
      abrEwmaDefaultEstimate: 300000
    });
    hlsRef.current = hls;

    if (Hls.isSupported()) {
      hls.loadSource(source);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setLevels(data.levels);
        setDuration(audioRef.current.duration);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });

      return () => {
        hls.destroy();
      };
    } else if (audioRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      audioRef.current.src = source;
    }
  }, [source]);

  const handleQualityChange = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const bounds = progressBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = x / width;
    const seekTime = percentage * duration;
    
    audioRef.current.currentTime = seekTime;
    setPosition(seekTime);
  };

  const handleTimeUpdate = () => {
    setPosition(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  };

  return (
    <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Streaming Audio
      </h2>

      <div className="bg-gray-800 bg-opacity-60 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <button
              className={`p-2 rounded-full ${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-500'
              } transition`}
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </button>
            
            {levels.length > 0 && (
              <select
                className="bg-gray-700 text-sm rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-purple-500"
                value={currentLevel}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
              >
                <option value={-1}>Auto Quality</option>
                {levels.map((level, index) => (
                  <option key={index} value={index}>
                    {level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}kbps`}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              className="bg-gray-700 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-purple-500"
              onChange={(e) => {
                audioRef.current.playbackRate = parseFloat(e.target.value);
              }}
              defaultValue="1"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>

        <div 
          className="w-full bg-gray-700 bg-opacity-50 rounded-full h-2 overflow-hidden cursor-pointer mb-2"
          onClick={handleSeek}
        >
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
            style={{ width: `${duration ? (position / duration) * 100 : 0}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(position)}</span>
          <span>{duration ? formatTime(duration) : "--:--"}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onDurationChange={() => setDuration(audioRef.current.duration)}
      />
    </div>
  );
}