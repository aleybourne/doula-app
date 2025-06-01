
import React, { useState } from "react";
import { AppointmentProps } from "./types";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendlyModal } from "./CalendlyModal";

const calendlyUrl = "https://calendly.com/";

// Remove static appointments - each user should have their own appointments
const appointments: AppointmentProps[] = [];

const Appointment: React.FC<AppointmentProps> = ({
  time,
  title,
  subtitle,
  avatarType,
  avatarUrl,
  avatarSvg,
  avatarFallback,
}) => (
  <div className="flex items-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white mb-2.5 px-2.5 py-2 rounded-[15px] md:px-2.5 md:py-2 sm:px-2 sm:py-1">
    <div className="text-xs font-light text-[#1B3F58] mr-2.5">{time}</div>
    <div className="grow">
      <div className="text-base md:text-base sm:text-sm font-bold text-[#1B3F58]">{title}</div>
      <div className="text-xs font-light text-[#1B3F58]">{subtitle}</div>
    </div>
    <div>
      {avatarType === "photo" && avatarUrl ? (
        <Avatar>
          <AvatarImage src={avatarUrl} alt={avatarFallback} className="w-10 h-10 object-cover border border-gray-300" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      ) : avatarType === "svg" && avatarSvg ? (
        <span
          className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border border-gray-300"
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />
      ) : (
        <Avatar>
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
    </div>
  </div>
);

export const AppointmentList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCalendlyClick = () => {
    setModalOpen(true);
    toast({
      title: "Calendly Integration",
      description: "Open Calendly to view and schedule appointments right here.",
    });
  };

  return (
    <section className="px-[23px] md:px-[23px] sm:px-1 py-0">
      <button
        type="button"
        onClick={handleCalendlyClick}
        className="w-full text-left bg-[#E5DEFF]/60 hover:bg-[#E5DEFF] focus:bg-[#D6BCFA]/70 p-0 rounded-xl shadow transition-all group outline-none border-2 border-transparent focus-visible:border-[#6E59A5]"
        style={{ transition: "background 0.15s, border 0.15s" }}
        tabIndex={0}
        aria-label="View and schedule appointments via Calendly"
      >
        <div className="text-base font-semibold text-[#1B3F58] mb-2.5 px-5 pt-4 group-hover:underline md:text-base sm:text-sm md:px-5 md:pt-4 sm:px-2 sm:pt-2">
          Appointments: {appointments.length}/20
        </div>
        <div className="pb-3 md:pb-3 sm:pb-1">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No appointments scheduled</p>
              <p className="text-sm mt-1">Click to add appointments via Calendly</p>
            </div>
          ) : (
            appointments.map((appointment, index) => (
              <Appointment key={index} {...appointment} />
            ))
          )}
        </div>
      </button>
      <CalendlyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        calendlyUrl={calendlyUrl}
      />
    </section>
  );
};
