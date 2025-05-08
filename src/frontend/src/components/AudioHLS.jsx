import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function AudioHLS({ source }) {
  const audioRef = useRef();
  const hlsRef = useRef();
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 for auto

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

  return (
    <div>
      <audio
        ref={audioRef}
        controls
        src={Hls.isSupported() ? undefined : source} 
      />
      
      {levels.length > 0 && (
        <div className="quality-selector">
          <label>Quality: </label>
          <select
            value={currentLevel}
            onChange={(e) => handleQualityChange(Number(e.target.value))}
          >
            <option value={-1}>Auto</option>
            {levels.map((level, index) => (
              <option key={index} value={index}>
                {level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}kbps`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
