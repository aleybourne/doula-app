
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClientData } from "../types/ClientTypes";
import ClientDetailsSection from "./ClientDetailsSection";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ClientStatusProps {
  dueDateLabel: string;
  onDelivered: (clientName: string, deliveryDate: Date) => void;
  client: ClientData;
}

const ClientStatus: React.FC<ClientStatusProps> = ({ dueDateLabel, onDelivered, client }) => {
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | undefined>(
    client.deliveryDate ? new Date(client.deliveryDate) : new Date()
  );
  const { toast } = useToast();

  const handleDeliveryConfirm = () => {
    if (selectedDeliveryDate) {
      onDelivered(client.name, selectedDeliveryDate);
      setIsDeliveryDialogOpen(false);
      toast({
        title: "Client Marked as Delivered",
        description: `${client.name} has been marked as delivered on ${format(selectedDeliveryDate, "MMMM d, yyyy")}`,
      });
    }
  };

  const renderDeliveryStatus = () => {
    if (client.status === 'delivered' && client.deliveryDate) {
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
      <Button 
        variant="secondary" 
        className="flex-1 py-3 px-1 flex flex-col items-center text-gray-500"
        onClick={() => setIsDeliveryDialogOpen(true)}
        disabled={client.status === 'delivered'}
      >
        <span className="text-[1.1rem] font-semibold text-gray-400">Delivered</span>
      </Button>
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

      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Client as Delivered</DialogTitle>
            <DialogDescription>
              Select the date when {client.name} delivered their baby.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDeliveryDate}
              onSelect={setSelectedDeliveryDate}
              className="mx-auto"
              disabled={(date) => 
                date > new Date() || 
                date < new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              initialFocus
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button 
              type="button" 
              variant="default" 
              onClick={handleDeliveryConfirm}
              className="bg-[#F499B7] hover:bg-[#F499B7]/90"
              disabled={!selectedDeliveryDate}
            >
              Confirm Delivery
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsDeliveryDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientStatus;
