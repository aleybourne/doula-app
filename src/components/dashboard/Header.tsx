
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const todayStr = format(new Date(), "M/d/yyyy");
  const isHomePage = location.pathname === '/home';
  const isClientsPage = location.pathname === '/clients';
  const { user } = useAuth();
  
  const displayName = user?.firstName || "Doula";

  const handleBack = () => {
    if (isClientsPage) {
      // From clients page, always go back to home
      navigate("/home");
    } else {
      // From other pages, go back one step
      navigate(-1);
    }
  };

  return (
    <header className="flex flex-col">
      <div className="text-xl font-light text-center mt-2.5">{todayStr}</div>
      <div className="flex items-center justify-between px-2 mx-0 my-2.5">
        {!isHomePage ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-8 w-8"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-8"></div> /* Empty div for balance on home page */
        )}
        <div
          className="font-custom text-[28px] md:text-[36px] font-normal"
          style={{ fontWeight: 400 }}
        >
          Hello, {displayName}!
        </div>
        <div className="w-8"></div> {/* Empty div for balance */}
      </div>
    </header>
  );
};
