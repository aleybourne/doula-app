
import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { ImageErrorBoundary } from "@/components/ui/ImageErrorBoundary";

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  avatarUrl: string;
  alt: string;
  progressColor?: string;
}

const PROGRESS_BG = "#eee";
const DEFAULT_PROGRESS_COLOR = "#F499B7";

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 96,
  strokeWidth = 6,
  avatarUrl,
  alt,
  progressColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Ensure progress is a valid number between 0 and 1
  const safeProgress = isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - safeProgress);
  const imgSize = size - strokeWidth * 2;
  
  // Use provided color or default
  const actualProgressColor = progressColor || DEFAULT_PROGRESS_COLOR;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="block"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          transform: "rotate(-90deg)", // Starts at 12 o'clock position
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={PROGRESS_BG}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={actualProgressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
      
      <ImageErrorBoundary>
        <SafeImage
          src={avatarUrl}
          alt={alt}
          className="rounded-full object-cover border-2 border-white"
          style={{
            position: "absolute",
            top: strokeWidth,
            left: strokeWidth,
            width: imgSize,
            height: imgSize,
            zIndex: 2,
            background: "#fff",
          }}
          fallbackSrc="/placeholder.svg"
          placeholderSrc="/placeholder.svg"
          showRetryButton={false}
          maxRetries={2}
        />
      </ImageErrorBoundary>
    </div>
  );
};

export default ProgressCircle;
