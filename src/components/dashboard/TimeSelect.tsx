
import * as React from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, ArrowUp, ArrowDown } from "lucide-react";

interface TimeSelectProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
const MINUTE_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const PERIODS: Array<'AM' | 'PM'> = ['AM', 'PM'];

export const TimeSelect: React.FC<TimeSelectProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select time" 
}) => {
  // Parse the value to set initial state
  const parseTime = React.useCallback((timeStr: string) => {
    if (!timeStr) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const p: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      // Find closest minute step
      const closestMinute = MINUTE_STEPS.reduce((prev, curr) => 
        Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev
      );
      return { h: h12, m: closestMinute, p };
    }
    let [h24, m] = timeStr.split(":").map(Number);
    let p: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
    let h = h24 % 12 === 0 ? 12 : h24 % 12;
    // Find closest minute step
    const closestMinute = MINUTE_STEPS.reduce((prev, curr) => 
      Math.abs(curr - parseInt(m.toString())) < Math.abs(prev - parseInt(m.toString())) ? curr : prev
    , MINUTE_STEPS[0]);
    return { h, m: closestMinute, p };
  }, []);

  const initialTime = React.useMemo(() => parseTime(value), [value, parseTime]);
  
  const [hours, setHours] = React.useState<number>(initialTime.h);
  const [minutes, setMinutes] = React.useState<number>(initialTime.m);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(initialTime.p);

  // For editable inputs
  const hourInputRef = React.useRef<HTMLInputElement>(null);
  const minuteInputRef = React.useRef<HTMLInputElement>(null);

  // Update local state when value prop changes
  React.useEffect(() => {
    const parsedTime = parseTime(value);
    setHours(parsedTime.h);
    setMinutes(parsedTime.m);
    setPeriod(parsedTime.p);
  }, [value, parseTime]);

  const currentFormattedTime = value
    ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`
    : placeholder;

  const handleSave = () => {
    let h24 = period === "PM"
      ? (hours === 12 ? 12 : hours + 12)
      : (hours === 12 ? 0 : hours);
    onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  // Allow user to manually change the number for hours input
  const handleHourInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // digits only
    if (!val) val = "1";
    let num = Math.max(1, Math.min(12, parseInt(val)));
    setHours(num);
  };

  // Allow user to manually change the number for minutes input
  const handleMinuteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // digits only
    if (!val) val = "0";
    let num = Math.max(0, Math.min(59, parseInt(val)));
    setMinutes(num);
  };

  // Snap minutes to closest step on blur, but allow any 0-59 value
  const handleMinuteBlur = () => {
    const closestMinute = MINUTE_STEPS.reduce((prev, curr) =>
      Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
    );
    setMinutes(closestMinute);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[120px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {currentFormattedTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[290px] p-4 space-y-4">
        <div className="flex justify-between items-center gap-2">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              aria-label="Increase hour"
              onClick={() => setHours(h => h === 12 ? 1 : h + 1)}
              className="mb-2 hover:bg-[#EEE] rounded-full p-1"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <input
              ref={hourInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={12}
              value={hours}
              onChange={handleHourInput}
              className="text-xl font-semibold w-10 text-center border-0 focus:ring-2 focus:ring-[#9b87f5] rounded"
              aria-label="Set hour"
            />
            <button
              type="button"
              aria-label="Decrease hour"
              onClick={() => setHours(h => h === 1 ? 12 : h - 1)}
              className="mt-2 hover:bg-[#EEE] rounded-full p-1"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              aria-label="Increase minute"
              onClick={() => setMinutes(m => {
                const idx = MINUTE_STEPS.indexOf(MINUTE_STEPS.includes(m) ? m : MINUTE_STEPS[0]);
                return MINUTE_STEPS[(idx + 1) % MINUTE_STEPS.length];
              })}
              className="mb-2 hover:bg-[#EEE] rounded-full p-1"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <input
              ref={minuteInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={59}
              value={minutes.toString().padStart(2,"0")}
              onChange={handleMinuteInput}
              onBlur={handleMinuteBlur}
              className="text-xl font-semibold w-10 text-center border-0 focus:ring-2 focus:ring-[#9b87f5] rounded"
              aria-label="Set minute"
            />
            <button
              type="button"
              aria-label="Decrease minute"
              onClick={() => setMinutes(m => {
                const idx = MINUTE_STEPS.indexOf(MINUTE_STEPS.includes(m) ? m : MINUTE_STEPS[0]);
                return MINUTE_STEPS[(idx - 1 + MINUTE_STEPS.length) % MINUTE_STEPS.length];
              })}
              className="mt-2 hover:bg-[#EEE] rounded-full p-1"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
          {/* Period */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              aria-label="Set AM"
              onClick={() => setPeriod('AM')}
              className={`mb-2 px-2 py-1 rounded ${period === 'AM' ? 'bg-[#9b87f5] text-white font-bold' : 'bg-[#EEE] text-[#7E69AB]'}`}
            >
              AM
            </button>
            <button
              type="button"
              aria-label="Set PM"
              onClick={() => setPeriod('PM')}
              className={`px-2 py-1 rounded ${period === 'PM' ? 'bg-[#9b87f5] text-white font-bold' : 'bg-[#EEE] text-[#7E69AB]'}`}
            >
              PM
            </button>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          className="w-full"
          type="button"
        >
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};
