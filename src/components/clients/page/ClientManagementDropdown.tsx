
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { updateClientStatus } from "../store/clientActions";
import { useClientStore } from "../hooks/useClientStore";

interface ClientManagementDropdownProps {
  clientName: string; // Keep using clientName for now but implement ID-based operations
}

const ClientManagementDropdown: React.FC<ClientManagementDropdownProps> = ({ clientName }) => {
  const navigate = useNavigate();
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'past' | null>(null);
  const { clients } = useClientStore();
  
  // Find client ID from name
  const client = clients.find(c => c.name === clientName);
  const clientId = client?.id || '';

  const handleStatusChange = () => {
    if (selectedStatus && clientId) {
      const reason = selectedStatus === 'past' ? 'Services completed' : 'Client reactivated';
      updateClientStatus(clientId, selectedStatus, reason);
      toast({
        title: "Client Status Updated",
        description: `${clientName} has been marked as ${selectedStatus}.`,
      });
      setStatusChangeDialogOpen(false);
      navigate("/clients");
    }
  };

  const openStatusChangeDialog = (status: 'active' | 'past') => {
    setSelectedStatus(status);
    setStatusChangeDialogOpen(true);
  };

  const currentStatus = client?.status || 'active';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreVertical className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Open client menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Client Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {currentStatus !== 'active' && (
              <DropdownMenuItem onClick={() => openStatusChangeDialog('active')}>
                <AlertCircle className="mr-2 h-4 w-4" />
                <span>Mark as Active</span>
              </DropdownMenuItem>
            )}
            {currentStatus !== 'past' && (
              <DropdownMenuItem onClick={() => openStatusChangeDialog('past')}>
                <AlertCircle className="mr-2 h-4 w-4" />
                <span>Mark as Past Client</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={statusChangeDialogOpen} onOpenChange={setStatusChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Client Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark <strong>{clientName}</strong> as {selectedStatus}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientManagementDropdown;
