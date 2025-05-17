
import React from "react";
import { Button } from "@/components/ui/button";
import { ClientData } from "../types/ClientTypes";
import ClientCard from "../ClientCard";
import { calculateGestationAndTrimester } from "../utils/gestationUtils";

interface ArchivedClientItemProps {
  client: ClientData;
  onRestore: (clientId: string, event: React.MouseEvent) => void; // Changed to clientId
  onCardClick: (clientId: string) => void; // Changed to clientId
}

const ArchivedClientItem: React.FC<ArchivedClientItemProps> = ({
  client,
  onRestore,
  onCardClick,
}) => {
  const { 
    gestation, 
    trimester, 
    isPastDue, 
    progress, 
    isPostpartum, 
    postpartumProgress 
  } = calculateGestationAndTrimester(
    client.dueDateISO, 
    client.status, 
    client.deliveryDate
  );
  
  return (
    <div className="relative">
      <ClientCard
        name={client.name}
        dueDateLabel={client.dueDateLabel}
        gestation={gestation}
        trimester={trimester}
        image={client.image}
        accent="border-gray-400"
        progress={progress}
        isPastDue={isPastDue}
        isPostpartum={isPostpartum}
        postpartumProgress={postpartumProgress}
        status={client.status}
        onClick={() => onCardClick(client.id)} // Pass client.id instead of client.name
      />
      <div className="absolute top-2 right-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => onRestore(client.id, e)} // Pass client.id instead of client.name
          className="bg-white text-xs py-1 px-2 h-auto"
        >
          Restore
        </Button>
      </div>
      {client.statusReason && (
        <div className="text-xs text-gray-500 -mt-6 mb-6 ml-4">
          Reason: {client.statusReason} • Archived: {new Date(client.statusDate || "").toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default ArchivedClientItem;
