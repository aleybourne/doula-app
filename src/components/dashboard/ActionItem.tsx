
import React from "react";
import { ActionItemProps } from "./types";

export const ActionItem: React.FC<ActionItemProps> = ({
  icon,
  label,
  bgColor,
  altText,
}) => (
  <button
    type="button"
    className={`flex flex-col items-center border ${bgColor} rounded-[15px] border-solid border-[#DADADA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E59A5] hover:scale-105 transition-transform duration-150
      w-[115px] h-[100px] sm:w-[92px] sm:h-[80px]
      justify-center shadow
    `}
    aria-label={label}
    tabIndex={0}
  >
    <img
      src={icon}
      alt={altText}
      className="mb-2 w-[54px] h-[54px] sm:w-[38px] sm:h-[38px]"
    />
    <div className="text-lg sm:text-base font-semibold text-center text-black">
      {label}
    </div>
  </button>
);

