
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useClientsStore } from "./hooks/useClientsStore";
import ArchiveToggle from "./client-list/ArchiveToggle";
import ClientListSection from "./client-list/ClientListSection";
import ArchivedClientList from "./client-list/ArchivedClientList";
import { useClientFiltering } from "./client-list/useClientFiltering";
import { getCurrentUserId } from "./store/clientStore";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientListProps {
  searchQuery?: string;
  filter?: string | null;
}

const ClientList: React.FC<ClientListProps> = ({ searchQuery = "", filter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showArchived, setShowArchived] = useState(false);
  const userId = getCurrentUserId();
  const [forceRefresh, setForceRefresh] = useState(0);
  
  const { 
    getActiveClients, 
    getArchivedClients, 
    restoreClient,
    isLoading
  } = useClientsStore();
  
  // Log the filter value when it changes
  useEffect(() => {
    console.log("ClientList received filter:", filter);
  }, [filter]);

  // Force a refresh when the location (URL) changes to ensure filters apply correctly
  useEffect(() => {
    console.log("Location changed, forcing refresh");
    setForceRefresh(prev => prev + 1);
  }, [location]);
  
  // Get clients based on archived status
  const allClients = showArchived ? getArchivedClients() : getActiveClients();
  
  // Apply filters and search (with key that includes forceRefresh)
  const filteredClients = useClientFiltering(allClients, searchQuery, filter);

  // Log the number of clients after filtering
  useEffect(() => {
    console.log(`ClientList: After filtering, found ${filteredClients.length} clients`);
  }, [filteredClients]);

  const handleRestoreClient = (clientName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    restoreClient(clientName);
    toast({
      title: "Client Restored",
      description: `${clientName} has been restored to active status.`,
    });
  };

  const handleCardClick = (clientName: string) => {
    console.log(`Navigating to client: ${clientName}`);
    navigate(`/clients/${encodeURIComponent(clientName)}`);
  };

  // Helper function to generate appropriate title
  const getFilterTitle = () => {
    if (filter === "new") return "New Clients (Last 3 Weeks)";
    if (filter === "upcoming") return "Upcoming Births (30+ Weeks)";
    return "Active Clients";
  };

  if (isLoading) {
    return (
      <div className="mb-20">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20">
      <ArchiveToggle 
        showArchived={showArchived} 
        onToggle={() => setShowArchived(!showArchived)} 
      />

      {!showArchived ? (
        <ClientListSection
          title={getFilterTitle()}
          clients={filteredClients}
          onCardClick={handleCardClick}
          emptyMessage={
            userId ? (
              filter ? 
              `No ${filter === "new" ? "new" : "upcoming"} clients found.` :
              "No active clients found. Add your first client!"
            ) : "Please log in to view your clients."
          }
        />
      ) : (
        <ArchivedClientList
          clients={filteredClients}
          onRestore={handleRestoreClient}
          onCardClick={handleCardClick}
        />
      )}
    </div>
  );
};

export default ClientList;
