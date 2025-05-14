
import * as React from "react";

type Event = {
  id: number;
  title: string;
  description?: string;
  color: string;
  locationType?: "Location" | "Video Call";
  locationValue?: string;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
};

export const EventListItem: React.FC<{ event: Event }> = ({ event }) => (
  <li className="flex flex-col py-1">
    <span className="font-medium text-[#7E69AB] text-sm flex items-center gap-2">
      {/* Color Dot */}
      <span
        className="inline-block w-3 h-3 rounded-full mr-2"
        style={{ background: event.color }}
      />
      {event.title}
    </span>
    {(event.locationType || event.allDay || (event.startTime && event.endTime)) && (
      <span className="text-xs text-[#8E9196] flex gap-2">
        {event.locationType && (
          <span>
            {event.locationType === "Location" ? "📍" : "🎥"}
            {event.locationValue ? ` ${event.locationValue}` : ""}
          </span>
        )}
        {event.allDay
          ? "All Day"
          : event.startTime && event.endTime
          ? `${event.startTime} - ${event.endTime}`
          : ""}
      </span>
    )}
  </li>
);
