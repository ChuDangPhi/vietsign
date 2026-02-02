import React from "react";
import { VideoPlayer } from "../VideoPlayer";

export const VideoContainer: React.FC<{
  videoUrl: string;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  size?: "sm" | "md" | "lg";
}> = ({
  videoUrl,
  autoPlay = true,
  loop = true,
  showControls = true,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-32 h-24", // 128x96
    md: "w-80 h-60", // 320x240
    lg: "w-[480px] h-[360px]", // 480x360
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center shadow-lg flex-shrink-0`}
    >
      <VideoPlayer
        videoUrl={videoUrl}
        autoPlay={autoPlay}
        loop={loop}
        showControls={showControls}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
