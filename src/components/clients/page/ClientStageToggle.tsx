import React, { useState } from "react";
import { Button } from "../../ui/button";
import { ClientData, BirthStage } from "../types/ClientTypes";
import { updateClient } from "../store/clientActions";
import { useToast } from "@/hooks/use-toast";
import { Heart, Activity, Baby } from "lucide-react";
import DeliveryDetailsDialog from "./DeliveryDetailsDialog";

interface ClientStageToggleProps {
  client: ClientData;
}

const ClientStageToggle: React.FC<ClientStageToggleProps> = ({ client }) => {
  const { toast } = useToast();
  const currentStage = client.birthStage || 'pregnant';
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);

  const handleStageChange = async (newStage: BirthStage) => {
    if (newStage === currentStage) return;

    // If changing to delivered, show the dialog first
    if (newStage === 'delivered') {
      setShowDeliveryDialog(true);
      return;
    }

    // Handle other stage changes
    await updateStageWithoutDialog(newStage);
  };

  const updateStageWithoutDialog = async (newStage: BirthStage) => {
    try {
      const currentTime = new Date().toISOString();
      const updates: Partial<ClientData> = {
        ...client,
        birthStage: newStage,
      };

      // Set appropriate timestamps based on stage
      if (newStage === 'active-labor' && !client.laborStartTime) {
        updates.laborStartTime = currentTime;
      } else if (newStage === 'pregnant') {
        // Reset to pregnant status
        updates.pregnancyStatus = 'pregnant';
      }

      await updateClient(updates as ClientData);
      
      const stageLabels = {
        'pregnant': 'Pregnant',
        'active-labor': 'Active Labor',
        'delivered': 'Delivered'
      };

      toast({
        title: `Stage updated to ${stageLabels[newStage]}`,
        description: `Client is now in ${stageLabels[newStage].toLowerCase()} stage`,
      });
    } catch (error) {
      console.error("Error updating client stage:", error);
      toast({
        title: "Error",
        description: "Failed to update client stage",
        variant: "destructive",
      });
    }
  };

  const handleDeliverySubmit = async (deliveryData: {
    deliveryTime: string;
    deliveryWeight: string;
    deliveryLength: string;
    deliveryHeadCircumference: string;
  }) => {
    try {
      const updates: Partial<ClientData> = {
        ...client,
        birthStage: 'delivered',
        deliveryTime: deliveryData.deliveryTime,
        deliveryWeight: deliveryData.deliveryWeight,
        deliveryLength: deliveryData.deliveryLength,
        deliveryHeadCircumference: deliveryData.deliveryHeadCircumference,
        deliveryDate: deliveryData.deliveryTime,
        postpartumDate: deliveryData.deliveryTime,
        pregnancyStatus: 'postpartum',
      };

      await updateClient(updates as ClientData);

      toast({
        title: "Delivery details saved",
        description: "Client marked as delivered with delivery details",
      });
    } catch (error) {
      console.error("Error saving delivery details:", error);
      toast({
        title: "Error",
        description: "Failed to save delivery details",
        variant: "destructive",
      });
    }
  };

  const getStageIcon = (stage: BirthStage) => {
    switch (stage) {
      case 'pregnant':
        return <Heart className="h-4 w-4" />;
      case 'active-labor':
        return <Activity className="h-4 w-4" />;
      case 'delivered':
        return <Baby className="h-4 w-4" />;
    }
  };

  const getStageColor = (stage: BirthStage, isActive: boolean) => {
    if (isActive) {
      switch (stage) {
        case 'pregnant':
          return "bg-blue-500 text-white border-blue-500";
        case 'active-labor':
          return "bg-orange-500 text-white border-orange-500";
        case 'delivered':
          return "bg-green-500 text-white border-green-500";
      }
    } else {
      return "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground";
    }
  };

  const stages: { value: BirthStage; label: string }[] = [
    { value: 'pregnant', label: 'Pregnant' },
    { value: 'active-labor', label: 'Active Labor' },
    { value: 'delivered', label: 'Delivered' },
  ];

  // Don't show the toggle if client is marked as past
  if (client.status === 'past') {
    return (
      <div className="bg-muted rounded-lg p-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Client Status</div>
          <div className="text-lg font-semibold text-muted-foreground">Past Client</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">Current Stage</div>
        <div className="text-lg font-semibold">
          {stages.find(s => s.value === currentStage)?.label || 'Pregnant'}
        </div>
      </div>
      
      <div className="flex gap-2">
        {stages.map((stage) => {
          const isActive = stage.value === currentStage;
          return (
            <Button
              key={stage.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleStageChange(stage.value)}
              className={`flex-1 transition-all duration-200 ${getStageColor(stage.value, isActive)}`}
              disabled={isActive}
            >
              <div className="flex items-center gap-1.5">
                {getStageIcon(stage.value)}
                <span className="text-xs">{stage.label}</span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Show stage-specific timestamps */}
      {currentStage === 'active-labor' && client.laborStartTime && (
        <div className="text-xs text-muted-foreground text-center">
          Labor started: {new Date(client.laborStartTime).toLocaleString()}
        </div>
      )}
      
      {currentStage === 'delivered' && client.deliveryTime && (
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <div>
            Delivered: {new Date(client.deliveryTime).toLocaleString()}
          </div>
          {(client.deliveryWeight || client.deliveryLength) && (
            <div className="flex justify-center gap-2 text-xs">
              {client.deliveryWeight && <span>Weight: {client.deliveryWeight}</span>}
              {client.deliveryLength && <span>Length: {client.deliveryLength}</span>}
            </div>
          )}
        </div>
      )}

      <DeliveryDetailsDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        onSubmit={handleDeliverySubmit}
        defaultTime={client.deliveryTime}
      />
    </div>
  );
};

export default ClientStageToggle;