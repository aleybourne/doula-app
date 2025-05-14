
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Timer } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const ClientAlertButton: React.FC = () => {
  const handleContractionAlerts = () => {
    toast({
      title: "Coming Soon",
      description: "Contraction timer functionality will be available soon!",
    });
  };

  return (
    <div className="rounded-xl bg-white shadow px-4 py-4 mx-2 mt-3 mb-24 border border-[#F499B7] flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleContractionAlerts}
              className="w-full flex items-center justify-center bg-[#F9D1C2] text-[#2B2939] font-medium rounded-full py-3 px-4 shadow hover:bg-[#F9C8B3] transition-all focus-visible:ring-2 focus-visible:ring-ring focus:outline-none opacity-75"
              aria-label="Contraction Alerts - Coming Soon"
            >
              <span className="mr-2">Contraction Alerts</span>
              <Timer className="w-5 h-5 text-[#A085E9]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon: Track contractions for your clients</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ClientAlertButton;
