
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, ArchiveIcon, Trash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { archiveClient, deleteClient } from "../clientsData";

interface ClientManagementDropdownProps {
  clientName: string;
}

const archiveReasons = [
  { id: "postpartum", label: "Postpartum Period Complete" },
  { id: "moved", label: "Client Moved" },
  { id: "complete", label: "Services Complete" },
  { id: "other", label: "Other" },
];

const deleteReasons = [
  { id: "duplicate", label: "Duplicate Entry" },
  { id: "request", label: "Client Request" },
  { id: "early", label: "Service Ended Early" },
  { id: "other", label: "Other" },
];

const ClientManagementDropdown: React.FC<ClientManagementDropdownProps> = ({ clientName }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteReason, setSelectedDeleteReason] = useState<string | null>(null);

  const handleArchive = (reason: string) => {
    archiveClient(clientName, reason);
    toast({
      title: "Client Archived",
      description: `${clientName} has been archived. Reason: ${reason}`,
    });
  };

  const handleDelete = () => {
    if (selectedDeleteReason) {
      deleteClient(clientName, selectedDeleteReason);
      toast({
        title: "Client Deleted",
        description: `${clientName} has been deleted. Reason: ${selectedDeleteReason}`,
      });
      setDeleteDialogOpen(false);
      navigate("/clients");
    }
  };

  const openDeleteConfirmation = (reason: string) => {
    setSelectedDeleteReason(reason);
    setDeleteDialogOpen(true);
  };

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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArchiveIcon className="mr-2 h-4 w-4" />
                <span>Archive Client</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {archiveReasons.map((reason) => (
                    <DropdownMenuItem key={reason.id} onClick={() => handleArchive(reason.label)}>
                      {reason.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Client</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {deleteReasons.map((reason) => (
                    <DropdownMenuItem 
                      key={reason.id} 
                      onClick={() => openDeleteConfirmation(reason.label)}
                      className="text-red-600"
                    >
                      {reason.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the client record for <strong>{clientName}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientManagementDropdown;
