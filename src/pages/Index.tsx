
import React from "react";
import { Header } from "@/components/dashboard/Header";
import { Stats } from "@/components/dashboard/Stats";
import { WeekdayPicker } from "@/components/dashboard/WeekdayPicker";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { BottomActions } from "@/components/dashboard/BottomActions";
import { useIsMobile } from "@/hooks/use-mobile";

const Index: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <div
        className={`w-full bg-white mx-auto my-0 flex flex-col ${
          isMobile
            ? "max-w-[425px] px-1"
            : "max-w-[452px] px-0"
        }`}
      >
        <Header />
        
        <main className={isMobile ? "px-1" : "px-4"}>
          <Stats />
          <WeekdayPicker />
          <AppointmentList />
          {/* Removed ActionGrid since it no longer has any content */}
          <BottomActions />
        </main>
      </div>
    </>
  );
};

export default Index;
