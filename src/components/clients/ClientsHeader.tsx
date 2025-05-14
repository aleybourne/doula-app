
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddClientButton } from "./AddClientButton";

interface ClientsHeaderProps {
  title?: string;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({ title = "Clients" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleBack = () => {
    // Navigate to home page directly instead of going back
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-4 pt-5 pb-2">
      <div className="flex items-center justify-between px-2">
        {!isHomePage && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-8 w-8"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="text-2xl text-center font-semibold tracking-wide flex-1">
          {title}
        </div>
        <div className="w-8"></div> {/* Empty div for balance */}
      </div>
      <div className="flex justify-center">
        <AddClientButton />
      </div>
    </div>
  );
};

export default ClientsHeader;
