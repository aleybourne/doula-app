import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, X, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { AddEventForm } from "./AddEventForm";
import { EVENT_COLORS } from "./eventColors";
import { CalendarDayContent } from "./CalendarDayContent";
import { DayEventList } from "./DayEventList";

type Event = {
  id: number;
  title: string;
  date: Date;
  description?: string;
  color: string;
  startDate?: Date;
  endDate?: Date;
  allDay?: boolean;
  locationType?: "Location" | "Video Call";
  locationValue?: string;
  startTime?: string;
  endTime?: string;
};

interface MonthlyCalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MonthlyCalendarModal: React.FC<MonthlyCalendarModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: 1,
      title: "Client Call",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "Call with Sam Williams",
      color: "#9b87f5",
    },
    {
      id: 2,
      title: "Planning Session",
      date: new Date(),
      description: "Sprint planning meeting",
      color: "#8B5CF6",
    },
    {
      id: 3,
      title: "Dentist",
      date: new Date(new Date().setDate(new Date().getDate() + 4)),
      description: "Teeth cleaning",
      color: "#FEC6A1",
    },
  ]);
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [showAddEvent, setShowAddEvent] = React.useState(false);

  function handleAddEvent(formData: any) {
    let mainDate = formData.startDate || new Date();
    setEvents(prev => [
      ...prev,
      {
        id: Math.max(0, ...prev.map(ev => ev.id)) + 1,
        title: formData.title,
        date: mainDate,
        description: "",
        color: formData.color,
        startDate: formData.startDate,
        endDate: formData.endDate,
        allDay: formData.allDay,
        locationType: formData.locationType,
        locationValue: formData.locationValue,
        startTime: formData.startTime,
        endTime: formData.endTime,
      },
    ]);
    setShowAddEvent(false);
    setTimeout(() => setSelected(mainDate), 100);
  }

  const todayEvents =
    selected &&
    events.filter(e => isSameDay(e.date, selected as Date));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[96vw] rounded-2xl bg-white p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center px-4 pt-4 w-full">
            <span className="flex items-center gap-2 font-semibold text-lg text-[#1B3F58]">
              <CalendarIcon className="h-6 w-6 text-[#1B3F58]" aria-hidden />
              Calendar
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-[#F1F0FB]"
                aria-label="Add event"
                onClick={() => setShowAddEvent(true)}
              >
                <Plus className="w-6 h-6 text-[#9b87f5]" />
              </Button>
              <DialogClose asChild>
                <button
                  aria-label="Close modal"
                  className="rounded-full hover:bg-[#F1F0FB] ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-3 pt-1 flex justify-center items-center bg-gradient-to-b from-white to-[#F1F0FB]">
          <div className="bg-white rounded-xl shadow-md p-2 border border-[#E5DEFF] w-full">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              className="p-3 pointer-events-auto rounded-xl text-[#1B3F58] [&_.rdp-day_selected]:bg-[#9b87f5] [&_.rdp-day_selected]:text-white [&_.rdp-cell]:rounded-md [&_.rdp-day]:font-medium"
              components={{
                DayContent: ({ date }) => (
                  <CalendarDayContent day={date} events={events} />
                ),
              }}
            />
          </div>
        </div>
        <div className="pb-5 px-6">
          <div className="w-full bg-[#F1F0FB] rounded-xl shadow-inner p-3 min-h-[60px] mt-1 animate-fade-in">
            <div className="font-semibold text-[#1B3F58] mb-1 text-sm flex items-center gap-2">
              {selected ? format(selected, "EEEE, MMM d") : "Select a day"}
              {todayEvents && todayEvents.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#E5DEFF] text-[#7E69AB]">{todayEvents.length} event{todayEvents.length > 1 ? "s" : ""}</span>
              )}
            </div>
            <ul className="space-y-2">
              {todayEvents
                ? <DayEventList events={todayEvents} />
                : <li className="text-xs text-[#8E9196] mt-2">No events for this day.</li>}
            </ul>
          </div>
        </div>
        {showAddEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
            <AddEventForm
              defaultDate={selected}
              onSubmit={handleAddEvent}
              onCancel={() => setShowAddEvent(false)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
