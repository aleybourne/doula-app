
import React from "react";
import ProgressCircle from "./ProgressCircle";

const CARD_COLOR = "bg-[#f9f5f2]";

interface ClientCardProps {
  name: string;
  dueDateLabel: string;
  gestation: string;
  trimester?: string | null;
  image: string;
  accent?: string;
  progress: number;
  isPastDue: boolean;
  isPostpartum?: boolean;
  postpartumProgress?: number;
  status?: string;
  onClick?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  name,
  dueDateLabel,
  gestation,
  trimester,
  image,
  accent,
  progress,
  isPastDue,
  isPostpartum,
  postpartumProgress,
  status,
  onClick,
}) => {
  // Determine the progress color based on client status
  const getProgressColor = () => {
    if (status === 'delivered') {
      return "#A085E9"; // Purple for postpartum
    }
    if (isPastDue) {
      return "#A085E9"; // Purple for past due
    }
    return "#F499B7"; // Default pink for active pregnancy
  };

  // Use postpartum progress if client is in postpartum period
  const displayProgress = isPostpartum && postpartumProgress !== undefined 
    ? postpartumProgress 
    : progress;

  return (
    <button
      type="button"
      className={
        "flex items-center w-full transition hover:shadow-md active:scale-[0.98] " +
        `${CARD_COLOR} rounded-2xl px-4 py-4 mb-6 shadow-sm border border-[#d6d0c5] text-left cursor-pointer`
      }
      style={{
        boxShadow: "0 2px 8px rgba(240, 210, 220, 0.10)",
        background: "#f9f5f2",
      }}
      onClick={onClick}
    >
      <div className="mr-6 flex-shrink-0" style={{ position: "relative" }}>
        <ProgressCircle 
          progress={displayProgress} 
          avatarUrl={image} 
          alt={name} 
          progressColor={getProgressColor()} 
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-sans font-normal text-[1.4rem] leading-[1.1] mb-0.5">
          {name}
        </div>
        <div className="text-base text-gray-700 mb-1 font-light font-sans">
          {status === 'delivered' ? `Delivered: ${dueDateLabel}` : `Due Date: ${dueDateLabel}`}
        </div>
        <div className="flex flex-col gap-0">
          <span className="font-sans font-normal text-2xl text-[#2B2939] leading-none drop-shadow-sm">
            {gestation}
          </span>
          {status === 'delivered' ? (
            <span className="text-sm text-purple-600 font-light font-sans">
              Postpartum Care
            </span>
          ) : trimester && (
            <span className="text-sm text-gray-700 font-light font-sans">
              {trimester}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ClientCard;
