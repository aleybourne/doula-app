
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="px-3 py-2 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleBack}
        className="h-8 w-8"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1"></div> {/* Spacer */}
    </div>
  );
};

export default ClientHeader;
