
import React from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProgressCircle from "@/components/clients/ProgressCircle";
import ClientTagsSection from "@/components/clients/ClientTagsSection";
import ClientManagementDropdown from "./ClientManagementDropdown";
import { EditClientForm } from "../EditClientForm";
import { ClientData } from "../types/ClientTypes";
import { clients } from "../clientsData";
import { Tag } from "../clientsTagsData";

interface ClientProgressProps {
  name: string;
  image: string;
  bgColor: string;
  gestation: string;
  trimester: string;
  progress: number;
  isPastDue: boolean;
  isPostpartum?: boolean;
  postpartumProgress?: number;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  tags: Tag[];
  status?: ClientData['status'];
}

const ClientProgress: React.FC<ClientProgressProps> = ({
  name,
  image,
  bgColor,
  gestation,
  trimester,
  progress,
  isPastDue,
  isPostpartum,
  postpartumProgress,
  expanded,
  setExpanded,
  tags,
  status,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  const handleUpdateClient = (updatedClient: ClientData) => {
    const clientIndex = clients.findIndex(c => c.name === name);
    if (clientIndex !== -1) {
      clients[clientIndex] = updatedClient;
      localStorage.setItem('clients', JSON.stringify(clients));
      window.location.href = `/clients/${encodeURIComponent(updatedClient.name)}`;
    }
  };

  // Determine the progress color based on client status
  const getProgressColor = () => {
    if (status === 'delivered') {
      return "#A085E9"; // Purple for postpartum
    }
    if (isPastDue) {
      return "#A085E9"; // Purple for past due
    }
    return "#F499B7"; // Default pink for active pregnancy
  };

  // Use postpartum progress if client is in postpartum period
  const displayProgress = isPostpartum && postpartumProgress !== undefined 
    ? postpartumProgress 
    : progress;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="relative">
        <div className={`rounded-2xl shadow-md px-4 py-4 mb-4 mt-1 flex ${bgColor} items-center`}>
          <div className="mr-4 relative">
            <ProgressCircle
              progress={displayProgress}
              avatarUrl={image}
              alt={name}
              progressColor={getProgressColor()}
            />
            <CollapsibleTrigger asChild>
              <button
                type="button"
                aria-label={expanded ? "Collapse card" : "Expand card"}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 p-1 rounded-full bg-white border shadow transition hover:bg-gray-100 active:scale-95"
                style={{ zIndex: 10 }}
              >
                {expanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </CollapsibleTrigger>
          </div>
          <div className="flex-1">
            <div className="font-sans font-semibold text-xl mb-1">{name}</div>
            <div className="flex flex-col">
              <span className="font-sans text-base text-gray-800">{gestation}</span>
              {status === 'delivered' ? (
                <span className="font-sans text-base text-purple-600">Postpartum Care</span>
              ) : (
                <span className="font-sans text-base text-gray-600">{trimester}</span>
              )}
            </div>
          </div>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="mr-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <EditClientForm
                client={clients.find(c => c.name === name)!}
                onUpdate={handleUpdateClient}
                onClose={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <ClientManagementDropdown clientName={name} />
        </div>
        <CollapsibleContent className="overflow-visible animate-fade-in" asChild>
          <div className={`rounded-2xl ${bgColor} shadow border border-[#f0e7f9] px-1 pt-1 pb-2 mx-1 mb-1`}>
            <ClientTagsSection initialTags={tags} bgColor={bgColor} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ClientProgress;
