
import React, { useState } from "react";
import { AppointmentProps } from "./types";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendlyModal } from "./CalendlyModal";

const calendlyUrl = "https://calendly.com/";

const appointments = [
  {
    time: "11-11:30am",
    title: "Client Check-in: Jane Miller",
    subtitle: "30min Zoom meeting",
    avatarType: "photo",
    avatarUrl: "/lovable-uploads/cda9c6dc-0e5b-48b5-96ec-932f937caa78.png",
    avatarFallback: "JM",
  },
  {
    time: "2pm-3pm",
    title: "Birth Planning Session: Jasmine Jones",
    subtitle: "30min Zoom meeting",
    avatarType: "photo",
    avatarUrl: "/lovable-uploads/50419604-6811-43ad-9a7a-56cc3714c181.png",
    avatarFallback: "JJ",
  },
  {
    time: "4:30pm-5pm",
    title: "Client Check-in: Benita Mendez",
    subtitle: "30min Zoom meeting",
    avatarType: "photo",
    avatarUrl: "/lovable-uploads/eb028e8e-c38f-4206-ac0d-192b345b0b66.png",
    avatarFallback: "BM",
  },
];

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
          Appointments: 3/20
        </div>
        <div className="pb-3 md:pb-3 sm:pb-1">
          {appointments.map((appointment, index) => (
            <Appointment key={index} {...appointment} />
          ))}
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
