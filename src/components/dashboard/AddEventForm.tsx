import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, MapPin, Video, Pencil, ToggleRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { EVENT_COLORS } from "./eventColors";
import { TimeSelect } from "./TimeSelect";

type EventFormData = {
  title: string;
  locationType: "Location" | "Video Call";
  locationValue: string;
  allDay: boolean;
  startDate: Date | undefined;
  startTime: string;
  endDate: Date | undefined;
  endTime: string;
  color: string;
};

interface AddEventFormProps {
  defaultDate: Date | undefined;
  onSubmit: (e: EventFormData) => void;
  onCancel: () => void;
}

const getDefaultTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

export const AddEventForm: React.FC<AddEventFormProps> = ({
  defaultDate,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = React.useState("");
  const [locationType, setLocationType] = React.useState<"Location" | "Video Call">("Location");
  const [locationValue, setLocationValue] = React.useState("");
  const [allDay, setAllDay] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(defaultDate);
  const [endDate, setEndDate] = React.useState<Date | undefined>(defaultDate);
  const [startTime, setStartTime] = React.useState(getDefaultTime());
  const [endTime, setEndTime] = React.useState(getDefaultTime());
  const [color, setColor] = React.useState(EVENT_COLORS[0].color);

  React.useEffect(() => {
    if (defaultDate) {
      setStartDate(defaultDate);
      setEndDate(defaultDate);
    }
  }, [defaultDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;
    onSubmit({
      title: title.trim(),
      locationType,
      locationValue: locationValue.trim(),
      allDay,
      startDate,
      startTime,
      endDate,
      endTime,
      color,
    });
  }

  return (
    <form
      className="bg-white rounded-2xl shadow-xl p-6 min-w-[310px] max-w-[90vw] w-full flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-[#1B3F58] flex items-center gap-2">
          <Pencil className="w-4 h-4 text-[#9b87f5]" />
          Add Event
        </h3>
        <button
          onClick={onCancel}
          type="button"
          className="rounded-full hover:bg-[#F1F0FB] ml-1"
          aria-label="Close add event form"
        >
          <span className="sr-only">Close</span>
          <span className="inline-block w-5 h-5 text-[#9b87f5]">&times;</span>
        </button>
      </div>

      <div>
        <Label htmlFor="event-title" className="block mb-1 text-[#7E69AB] flex items-center gap-1">
          <Pencil className="w-4 h-4 mr-1" />
          Title
        </Label>
        <Input
          id="event-title"
          placeholder="Event Title"
          maxLength={32}
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-[#F8F6FF] border border-[#E5DEFF] "
        />
      </div>

      <div>
        <Label className="block mb-1 text-[#7E69AB] flex items-center gap-1">Location or Video Call</Label>
        <div className="flex items-center gap-2">
          <select
            value={locationType}
            onChange={e =>
              setLocationType(e.target.value as "Location" | "Video Call")
            }
            className="border border-[#E5DEFF] rounded-md bg-[#F8F6FF] text-[#7E69AB] px-2 py-1 focus:outline-none"
          >
            <option value="Location">Location</option>
            <option value="Video Call">Video Call</option>
          </select>
          <span>
            {locationType === "Location" ? (
              <MapPin className="w-5 h-5 text-[#9b87f5]" />
            ) : (
              <Video className="w-5 h-5 text-[#9b87f5]" />
            )}
          </span>
        </div>
        <Input
          id="event-location"
          placeholder={
            locationType === "Location"
              ? "Enter a location"
              : "Enter video call link"
          }
          value={locationValue}
          onChange={e => setLocationValue(e.target.value)}
          className="bg-[#F8F6FF] border border-[#E5DEFF] mt-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={allDay}
          onCheckedChange={setAllDay}
          id="all-day-toggle"
        />
        <Label htmlFor="all-day-toggle" className="mb-0 flex items-center gap-1">
          <ToggleRight className="w-5 h-5 text-[#7E69AB]" />
          All-day
        </Label>
      </div>

      <div>
        <Label className="block mb-1 text-[#7E69AB] flex items-center gap-1">
          Starts
        </Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[128px] pl-3 text-left font-normal bg-[#F8F6FF] border-[#E5DEFF]",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? (
                  format(startDate, "yyyy-MM-dd")
                ) : (
                  <span>Pick date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {!allDay && (
            <TimeSelect
              value={startTime}
              onChange={setStartTime}
              placeholder="Start time"
            />
          )}
        </div>
      </div>

      <div>
        <Label className="block mb-1 text-[#7E69AB] flex items-center gap-1">
          Ends
        </Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[128px] pl-3 text-left font-normal bg-[#F8F6FF] border-[#E5DEFF]",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? (
                  format(endDate, "yyyy-MM-dd")
                ) : (
                  <span>Pick date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {!allDay && (
            <TimeSelect
              value={endTime}
              onChange={setEndTime}
              placeholder="End time"
            />
          )}
        </div>
      </div>

      <div>
        <Label className="block mb-1 text-[#7E69AB]">Event Color</Label>
        <div className="flex flex-wrap gap-2">
          {EVENT_COLORS.map(option => (
            <button
              key={option.color}
              type="button"
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center focus:outline-none transition-shadow ${
                color === option.color
                  ? "border-[#9b87f5] ring-2 ring-[#9b87f5]"
                  : "border-[#E5DEFF]"
              }`}
              style={{ background: option.color }}
              aria-label={option.name}
              onClick={() => setColor(option.color)}
            >
              {color === option.color && (
                <span className="w-3 h-3 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          className="rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-lg bg-[#9b87f5] hover:bg-[#7E69AB]">
          Add
        </Button>
      </div>
    </form>
  );
};
