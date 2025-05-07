import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function AudioHLS({source}) {
  const audioRef = useRef();

  useEffect(()=>{
    const hls = new Hls({
      "debug": true
    });

    if (Hls.isSupported()) {
      hls.log = true;
      hls.loadSource(source);
      hls.attachMedia(audioRef.current)
      hls.on(Hls.Events.ERROR, (err) => {
        console.log(err)
      });

    } else {
      console.log('load')
    }
  },[source])

  return (
    <audio
      ref={audioRef}
      controls
      src={source}
    />
  )
}
