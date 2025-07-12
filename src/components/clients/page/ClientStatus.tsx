
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

  const handleMarkDelivered = async () => {
    try {
      const currentDate = new Date().toISOString();
      const updatedClient = {
        ...client,
        deliveryDate: currentDate,
        postpartumDate: currentDate,
        status: 'active' as const // Keep as active but now postpartum
      };
      
      await updateClient(updatedClient);
      toast({
        title: "Client marked as delivered",
        description: "Client is now in postpartum status",
      });
    } catch (error) {
      console.error("Error marking client as delivered:", error);
      toast({
        title: "Error",
        description: "Failed to update client status",
        variant: "destructive",
      });
    }
  };

  const renderDeliveryStatus = () => {
    if (client.deliveryDate) {
      return (
        <div className="flex-1 bg-white shadow rounded-lg py-3 px-1 flex flex-col items-center border-green-200 border">
          <div className="text-xs text-gray-500">Delivered Date</div>
          <div className="text-[1.1rem] font-semibold text-green-600">
            {format(new Date(client.deliveryDate), "MMMM d, yyyy")}
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-gray-100 shadow rounded-lg py-3 px-1 flex flex-col items-center gap-2">
        <div className="text-xs text-gray-500">Status</div>
        <div className="text-[1.1rem] font-semibold text-gray-600">
          {client.status === 'past' ? 'Past Client' : 'Active'}
        </div>
        {client.status !== 'past' && (
          <Button 
            size="sm" 
            onClick={handleMarkDelivered}
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
