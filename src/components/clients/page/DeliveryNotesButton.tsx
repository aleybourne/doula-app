import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ClientData } from "../types/ClientTypes";

interface DeliveryNotesButtonProps {
  client: ClientData;
  onClick: () => void;
}

const DeliveryNotesButton: React.FC<DeliveryNotesButtonProps> = ({ client, onClick }) => {
  // Only show if client is in delivered stage
  if (client.birthStage !== 'delivered') {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
      aria-label="Delivery notes"
    >
      <FileText className="h-5 w-5" />
    </Button>
  );
};

export default DeliveryNotesButton;