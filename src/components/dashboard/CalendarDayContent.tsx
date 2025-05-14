
import * as React from "react";
import { isSameDay } from "date-fns";

// Event type for prop
type CalendarDayContentProps = {
  day: Date;
  events: Array<{ color: string; date: Date }>;
};

export const CalendarDayContent: React.FC<CalendarDayContentProps> = ({ day, events }) => {
  const dayEvents = events.filter(e => isSameDay(e.date, day));
  return (
    <div className="flex flex-col items-center justify-center">
      <span>{day.getDate()}</span>
      {dayEvents.length > 0 && (
        <span className="mt-0.5 flex gap-0.5">
          {dayEvents.slice(0, 3).map((e, i) => (
            <span
              key={i}
              className="inline-block rounded-full"
              style={{
                width: 7,
                height: 7,
                background: e.color,
              }}
            />
          ))}
          {dayEvents.length > 3 && (
            <span className="text-[8px] text-[#bbb] ml-0.5">+</span>
          )}
        </span>
      )}
    </div>
  );
};
