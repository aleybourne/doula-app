
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
  const [clientData, setClientData] = useState(null);
  
  useEffect(() => {
    console.log("=== NewClientPage: Effect triggered ===");
    console.log("Client ID:", clientId);
    console.log("Client Name:", clientName);
    console.log("Current User ID:", currentUserId);
    console.log("Retry Count:", retryCount);
    
    const loadClient = async () => {
      try {
        // Prevent infinite retries
        if (retryCount >= 3) {
          console.error("Max retries reached, showing error");
          setIsLoading(false);
          setNotFoundError(true);
          return;
        }

        // If we have an ID, use that first (preferred method)
        if (clientId) {
          console.log(`Looking for client with ID: ${clientId}`);
          const client = await getClientById(clientId);
          
          if (client) {
            console.log("Found client by ID:", client);
            setClientData(client);
            setIsLoading(false);
            setNotFoundError(false);
            return;
          }
        }
        
        // Fallback to name-based lookup for backward compatibility
        if (clientName) {
          console.log(`Looking for client by name: ${clientName}`);
          // Try to find client in the existing array
          const existingClient = clients.find(client => {
            // Only include clients that belong to this user
            if (client.userId !== currentUserId) {
              return false;
            }
            
            // Normalize both strings for comparison
            const normalizedName = client.name.toLowerCase().replace(/\s+/g, ' ').trim();
            const normalizedSearch = decodeURIComponent(clientName).toLowerCase().replace(/\s+/g, ' ').trim();
            return normalizedName === normalizedSearch;
          });
          
          if (existingClient) {
            console.log("Found client by name:", existingClient);
            // If we find by name, redirect to the ID-based URL
            if (existingClient.id) {
              console.log(`Redirecting to ID-based URL: /clients/id/${existingClient.id}`);
              navigate(`/clients/id/${existingClient.id}`, { replace: true });
              return;
            }
            
            setClientData(existingClient);
            setIsLoading(false);
            setNotFoundError(false);
            return;
          }
          
          // If not found in the existing array, try to get from store by name
          const clientByName = getClientByName(clientName);
          if (clientByName) {
            console.log("Retrieved client by name from store:", clientByName);
            
            // If we find by name, redirect to the ID-based URL
            if (clientByName.id) {
              console.log(`Redirecting to ID-based URL: /clients/id/${clientByName.id}`);
              navigate(`/clients/id/${clientByName.id}`, { replace: true });
              return;
            }
            
            setClientData(clientByName);
            setIsLoading(false);
            setNotFoundError(false);
            return;
          }
        }
        
        // If we get here and still haven't found the client, retry after a short delay
        console.log(`Client not found, will retry (${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000);
        
      } catch (error) {
        console.error("Error loading client:", error);
        setIsLoading(false);
        setNotFoundError(true);
      }
    };
    
    loadClient();
  }, [clientId, clientName, currentUserId, retryCount, navigate]); // Removed clients dependency to prevent infinite loop
  
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
