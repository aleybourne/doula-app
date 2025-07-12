
import React from "react";
import { ClientData } from "../types/ClientTypes";
import ClientDetailsSection from "./ClientDetailsSection";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import { updateClient } from "../store/clientActions";
import { useToast } from "@/hooks/use-toast";

interface ClientStatusProps {
  dueDateLabel: string;
  client: ClientData;
}

const ClientStatus: React.FC<ClientStatusProps> = ({ dueDateLabel, client }) => {
  const { toast } = useToast();

  const handleToggleDelivery = async () => {
    try {
      const isCurrentlyPostpartum = client.pregnancyStatus === 'postpartum';
      const currentDate = new Date().toISOString();
      
      const updatedClient = {
        ...client,
        pregnancyStatus: isCurrentlyPostpartum ? 'pregnant' as const : 'postpartum' as const,
        deliveryDate: isCurrentlyPostpartum ? undefined : currentDate,
        postpartumDate: isCurrentlyPostpartum ? undefined : currentDate,
      };
      
      await updateClient(updatedClient);
      toast({
        title: isCurrentlyPostpartum ? "Client marked as pregnant" : "Client marked as delivered",
        description: isCurrentlyPostpartum ? "Client is now in pregnant status" : "Client is now in postpartum status",
      });
    } catch (error) {
      console.error("Error updating client status:", error);
      toast({
        title: "Error",
        description: "Failed to update client status",
        variant: "destructive",
      });
    }
  };

  const renderDeliveryStatus = () => {
    const isPostpartum = client.pregnancyStatus === 'postpartum';
    
    if (isPostpartum && client.deliveryDate) {
      return (
        <div className="flex-1 bg-white shadow rounded-lg py-3 px-1 flex flex-col items-center gap-2 border-green-200 border">
          <div className="text-xs text-gray-500">Status</div>
          <div className="text-[1.1rem] font-semibold text-green-600">Postpartum</div>
          <div className="text-xs text-gray-500">
            {format(new Date(client.deliveryDate), "MMM d, yyyy")}
          </div>
          {client.status !== 'past' && (
            <Button 
              size="sm" 
              onClick={handleToggleDelivery}
              className="text-xs h-6 px-2"
              variant="outline"
            >
              Mark as Pregnant
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1 bg-gray-100 shadow rounded-lg py-3 px-1 flex flex-col items-center gap-2">
        <div className="text-xs text-gray-500">Status</div>
        <div className="text-[1.1rem] font-semibold text-gray-600">
          {client.status === 'past' ? 'Past Client' : 'Pregnant'}
        </div>
        {client.status !== 'past' && (
          <Button 
            size="sm" 
            onClick={handleToggleDelivery}
            className="text-xs h-6 px-2"
          >
            Delivered
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <ClientDetailsSection client={client} />
      
      <div className="flex justify-between gap-3 pb-2 px-2">
        <div className="flex-1 bg-white shadow rounded-lg py-3 px-1 flex flex-col items-center">
          <div className="text-xs text-gray-500">Due Date</div>
          <div className="text-[1.1rem] font-semibold text-[#2b2939]">{dueDateLabel}</div>
        </div>
        
        {renderDeliveryStatus()}
      </div>
    </div>
  );
};

export default ClientStatus;
