import React, { useRef } from "react";

function VideoPlayer() {
  const videoRef = useRef(null);

  const playVideo = () => videoRef.current.play();
  const pauseVideo = () => videoRef.current.pause();
  const forwardVideo = () => (videoRef.current.currentTime += 5);
  const rewindVideo = () => (videoRef.current.currentTime -= 5);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Video clip</h2>

      <video
        ref={videoRef}
        width="500"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={playVideo}>▶️ Play</button>
        <button onClick={pauseVideo}>⏸ Pause</button>
        <button onClick={rewindVideo}>⏪ Rewind</button>
        <button onClick={forwardVideo}>⏩ Forward</button>
      </div>
    </div>
  );
}

export default VideoPlayer;
