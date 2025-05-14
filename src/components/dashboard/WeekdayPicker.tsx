
import React from "react";

// JavaScript's Date.getDay(): 0 = Sunday, 1 = Monday, etc.
const WEEKDAYS = ["M", "T", "W", "Th", "F", "S", "Su"];
const JS_TO_WEEKDAY_INDEX = [6, 0, 1, 2, 3, 4, 5]; // JS: S,M,T,W,Th,F,Sa

export const WeekdayPicker: React.FC = () => {
  // Get JS day index and map to our array
  const today = new Date();
  const weekdayIdx = JS_TO_WEEKDAY_INDEX[today.getDay()];

  return (
    <section className="flex justify-around px-0 py-[9px] gap-3 md:gap-3 sm:gap-1">
      {WEEKDAYS.map((day, i) => (
        <button
          key={day}
          type="button"
          className={`flex items-center justify-center rounded-full border border-solid border-[#DADADA] text-2xl font-semibold shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          w-12 h-12 md:w-12 md:h-12 sm:w-10 sm:h-10 sm:text-lg
          ${
            i === weekdayIdx
              ? "bg-[#A085E9] text-white border-[#A085E9]" // highlighted
              : "bg-[#DFE8FB] text-[#37384A]"
          }`}
          aria-current={i === weekdayIdx ? "date" : undefined}
        >
          {day}
        </button>
      ))}
    </section>
  );
};
