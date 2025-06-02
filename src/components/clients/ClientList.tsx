
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useClientsStore } from "./hooks/useClientsStore";
import ClientListSection from "./client-list/ClientListSection";
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
  const userId = getCurrentUserId();
  const [forceRefresh, setForceRefresh] = useState(0);
  
  const { 
    getActiveClients,
    isLoading
  } = useClientsStore();
  
  // Log the filter value when it changes
  useEffect(() => {
    console.log(`=== ClientList RECEIVED FILTER ===`);
    console.log(`Filter: ${filter}`);
    console.log(`Search query: "${searchQuery}"`);
    console.log(`Current user: ${userId}`);
  }, [filter, searchQuery, userId]);

  // Force a refresh when the location (URL) changes to ensure filters apply correctly
  useEffect(() => {
    console.log("ClientList: Location changed, forcing refresh");
    setForceRefresh(prev => prev + 1);
  }, [location]);
  
  // Get active clients only
  const allClients = getActiveClients();
  
  // Log the clients before filtering
  useEffect(() => {
    console.log(`=== ClientList: RAW CLIENTS DATA ===`);
    console.log(`Raw clients count: ${allClients.length}`);
    if (allClients.length > 0) {
      console.log(`Raw clients:`);
      allClients.forEach((client, index) => {
        console.log(`  ${index + 1}. ${client.name} (status: ${client.status || 'no status'}, userId: ${client.userId})`);
      });
    }
  }, [allClients]);
  
  // Apply filters and search (with key that includes forceRefresh)
  const filteredClients = useClientFiltering(allClients, searchQuery, filter);

  // Log the number of clients after filtering
  useEffect(() => {
    console.log(`=== ClientList: AFTER FILTERING ===`);
    console.log(`Filtered clients count: ${filteredClients.length}`);
    if (filteredClients.length > 0) {
      console.log(`Filtered clients:`);
      filteredClients.forEach((client, index) => {
        console.log(`  ${index + 1}. ${client.name}`);
      });
    }
  }, [filteredClients]);

  const handleCardClick = (clientId: string) => {
    console.log(`Navigating to client ID: ${clientId}`);
    navigate(`/clients/id/${clientId}`);
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
    </div>
  );
};

export default ClientList;
