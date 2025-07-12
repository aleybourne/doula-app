
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientPageTemplate from "./ClientPageTemplate";
import { clientsTags } from "./clientsTagsData";
import { useClientStore } from "./clientsData";
import { getCurrentUserId, getClientById, getClientByName } from "./store/clientStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface NewClientPageProps {
  clientId?: string;
  clientName?: string;
}

const NewClientPage: React.FC<NewClientPageProps> = ({ clientId, clientName }) => {
  const navigate = useNavigate();
  const { clients } = useClientStore();
  const currentUserId = getCurrentUserId();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [notFoundError, setNotFoundError] = useState(false);
  
  // Get client from live store data instead of local state
  const clientData = React.useMemo(() => {
    if (clientId) {
      return clients.find(client => client.id === clientId && client.userId === currentUserId);
    }
    if (clientName) {
      return clients.find(client => {
        if (client.userId !== currentUserId) return false;
        const normalizedName = client.name.toLowerCase().replace(/\s+/g, ' ').trim();
        const normalizedSearch = decodeURIComponent(clientName).toLowerCase().replace(/\s+/g, ' ').trim();
        return normalizedName === normalizedSearch;
      });
    }
    return null;
  }, [clients, clientId, clientName, currentUserId]);
  
  useEffect(() => {
    console.log("=== NewClientPage: Effect triggered ===");
    console.log("Client ID:", clientId);
    console.log("Client Name:", clientName);
    console.log("Current User ID:", currentUserId);
    console.log("Clients loaded:", clients.length);
    console.log("Client found in store:", !!clientData);
    
    // If we have client data from the store, we're done loading
    if (clientData) {
      setIsLoading(false);
      setNotFoundError(false);
      
      // If we found by name and have an ID, redirect to ID-based URL
      if (clientName && clientData.id) {
        console.log(`Redirecting to ID-based URL: /clients/id/${clientData.id}`);
        navigate(`/clients/id/${clientData.id}`, { replace: true });
        return;
      }
      return;
    }
    
    // If we have clients loaded but no match found, show error
    if (clients.length > 0 && !clientData) {
      if (retryCount >= 2) {
        console.log("Client not found after retries");
        setIsLoading(false);
        setNotFoundError(true);
        return;
      }
      
      // Retry once more in case of timing issues
      console.log(`Client not found, retrying (${retryCount + 1}/3)`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
      return;
    }
    
    // Still waiting for clients to load
    setIsLoading(true);
    setNotFoundError(false);
  }, [clientId, clientName, currentUserId, clients, clientData, retryCount, navigate]);
  
  // Add error boundary logic
  if (notFoundError || (!clientData && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Client Not Found</h2>
          <p className="text-gray-700 mb-4">
            {clientId ? (
              <>We couldn't find a client with ID: <strong>{clientId}</strong></>
            ) : (
              <>We couldn't find the client: <strong>{decodeURIComponent(clientName || "")}</strong></>
            )}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            This may happen if the client was just added and is still being processed.
          </p>
          <Link to="/clients" className="text-blue-600 underline">
            Return to clients list
          </Link>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#F499B7] mb-4" />
        <p className="text-gray-500">Loading client data...</p>
        <p className="text-sm text-gray-400 mt-2">Attempt {retryCount + 1}/3</p>
      </div>
    );
  }

  if (!clientData) {
    console.error("No client data available but not loading or error state");
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Loading Error</h2>
          <p className="text-gray-700 mb-4">There was an issue loading the client data.</p>
          <Link to="/clients" className="text-blue-600 underline">
            Return to clients list
          </Link>
        </div>
      </div>
    );
  }

  const clientInfo = {
    ...clientData, // Spread all client data to include all fields
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags[clientData.name] || [],
  };

  console.log("=== NewClientPage: Rendering ClientPageTemplate ===");
  console.log("Client info:", clientInfo);

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default NewClientPage;
