
import * as React from "react";
import { EventListItem } from "./EventListItem";

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

export const DayEventList: React.FC<{ events: Event[] }> = ({ events }) => {
  if (!events.length) {
    return <li className="text-xs text-[#8E9196] mt-2">No events for this day.</li>;
  }
  return (
    <>
      {events.map(ev => <EventListItem key={ev.id} event={ev} />)}
    </>
  );
};
