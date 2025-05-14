
import * as React from "react";
import { cn } from "@/lib/utils";

interface TimeWheelColumnProps<T extends string | number> {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  type: "hour" | "minute" | "period";
  itemHeight?: number;
  // Optionally pass a padStart value for minutes
  padStart?: number;
}
export function TimeWheelColumn<T extends string | number>({
  options,
  value,
  onChange,
  type,
  itemHeight = 36,
  padStart = 2,
}: TimeWheelColumnProps<T>) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll to selected
  React.useEffect(() => {
    const idx = options.findIndex(opt => String(opt) === String(value));
    if (scrollRef.current && idx !== -1) {
      scrollRef.current.scrollTo({
        top: (idx) * itemHeight,
        behavior: "smooth",
      });
    }
  }, [value, options, itemHeight]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative w-16 overflow-y-auto h-[180px] scroll-smooth flex flex-col items-center px-0.5",
        "no-scrollbar"
      )}
      tabIndex={-1}
      style={{
        // hide default scrollbar (for webkit browsers, not all)
        scrollbarWidth: "none",
      }}
    >
      {/* Spacer for centering */}
      <div style={{ height: itemHeight * 2 }} aria-hidden />
      {options.map((opt, idx) => {
        const selected = String(value) === String(opt);
        return (
          <button
            key={opt}
            style={{
              height: itemHeight,
              width: "100%",
              fontWeight: selected ? 700 : 400,
              color: selected ? "#1B3F58" : "#bbb",
              fontSize: selected ? 22 : 16,
              background: selected ? "rgba(155,135,245,0.08)" : "transparent",
              borderRadius: 5,
              margin: 0,
              outline: "none",
              transition: "font-size 0.18s, color 0.18s",
            }}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={cn(
              "flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:z-10",
              selected ? "shadow-lg" : "hover:bg-[#EEE]"
            )}
            onClick={() => onChange(opt)}
            type="button"
          >
            {type === "minute"
              ? opt.toString().padStart(padStart, "0")
              : opt.toString()}
          </button>
        );
      })}
      {/* End spacer */}
      <div style={{ height: itemHeight * 2 }} aria-hidden />
      {/* Overlay for selected row */}
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{
          top: `calc(50% - ${itemHeight / 2}px)`,
          height: itemHeight,
          background: "#F1F0FB88",
          borderRadius: 8,
          zIndex: 2,
        }}
        aria-hidden
      />
    </div>
  );
}

// Hide scrollbars (can be added in global css if needed)
