
import React, { useEffect, useState } from "react";
import ClientPageTemplate from "./ClientPageTemplate";
import { clientsTags } from "./clientsTagsData";
import { useClientStore } from "./clientsData";
import { getCurrentUserId } from "./store/clientStore";
import { Loader2 } from "lucide-react";

interface NewClientPageProps {
  clientName: string;
}

const NewClientPage: React.FC<NewClientPageProps> = ({ clientName }) => {
  const { clients } = useClientStore();
  const currentUserId = getCurrentUserId();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [notFoundError, setNotFoundError] = useState(false);
  
  // Find client data from user's clients
  const findClient = () => {
    return clients.find(client => {
      // Only include clients that belong to this user
      if (client.userId !== currentUserId) {
        return false;
      }
      
      // Normalize both strings for comparison
      const normalizedName = client.name.toLowerCase().replace(/\s+/g, ' ').trim();
      const normalizedSearch = decodeURIComponent(clientName).toLowerCase().replace(/\s+/g, ' ').trim();
      return normalizedName === normalizedSearch;
    });
  };
  
  const clientData = findClient();
  
  useEffect(() => {
    if (clientData) {
      console.log("Found client data:", clientData);
      setIsLoading(false);
      setNotFoundError(false);
    } else {
      console.log(`Client search for '${decodeURIComponent(clientName)}', attempt ${retryCount + 1}`);
      console.log("Available clients:", clients.map(c => `'${c.name}'`).join(", "));
      
      // If we've tried 5 times and still can't find the client, show error
      if (retryCount >= 5) {
        console.error(`Client not found after ${retryCount} attempts: '${decodeURIComponent(clientName)}'`);
        setIsLoading(false);
        setNotFoundError(true);
        return;
      }
      
      // Try again in a second
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [clientName, clientData, clients, retryCount]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#F499B7] mb-4" />
        <p className="text-gray-500">Loading client data...</p>
      </div>
    );
  }
  
  if (notFoundError || !clientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Client Not Found</h2>
          <p className="text-gray-700 mb-4">
            We couldn't find the client: <strong>{decodeURIComponent(clientName)}</strong>
          </p>
          <p className="text-sm text-gray-500">
            This may happen if the client was just added and is still being processed.
          </p>
        </div>
      </div>
    );
  }

  const clientInfo = {
    ...clientData, // Spread all client data to include all fields
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags[clientData.name] || [],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default NewClientPage;
