
import React, { useState } from "react";
import { Users, Calendar, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { MonthlyCalendarModal } from "./MonthlyCalendarModal";

interface NavButtonProps {
  Icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ Icon, label, onClick, active }) => {
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 36 : 40;
  const btnSize = isMobile ? "h-[56px] w-[56px]" : "h-[56px] w-[56px]";
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex items-center justify-center p-0 bg-transparent border-none outline-none cursor-pointer hover:scale-110 transition-transform duration-150 ${btnSize} ${active ? "bg-zinc-100" : ""}`}
      onClick={onClick}
      tabIndex={0}
      disabled={active}
    >
      <Icon size={iconSize} color="#222" strokeWidth={2.2} />
    </button>
  );
};

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isClientsPage = location.pathname === "/clients";
  const isHomePage = location.pathname === "/";
  const [calendarOpen, setCalendarOpen] = useState(false);

  const navItems = [
    {
      Icon: Users,
      label: "Clients",
      onClick: () => {
        if (!isClientsPage) navigate("/clients");
      },
      active: isClientsPage,
    },
    {
      Icon: Home,
      label: "Home",
      onClick: () => {
        if (!isHomePage) navigate("/");
      },
      active: isHomePage,
    },
    {
      Icon: Calendar,
      label: "Calendar",
      onClick: () => setCalendarOpen(true),
      active: false,
    },
  ];

  return (
    <>
      <nav className="flex justify-around bg-white px-0 py-4 border-t border-zinc-200 gap-x-2 md:gap-x-2 sm:gap-x-1">
        {navItems.map((item, idx) => (
          <NavButton key={item.label} {...item} />
        ))}
      </nav>
      <MonthlyCalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} />
    </>
  );
};

