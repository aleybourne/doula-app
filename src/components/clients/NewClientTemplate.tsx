
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientPageTemplate from "./ClientPageTemplate";
import { clientsTags } from "./clientsTagsData";
import { useClientStore } from "./clientsData";
import { getCurrentUserId, getClientById, getClientByName } from "./store/clientStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ClientDebugPanel from "./debug/ClientDebugPanel";
import CreateFirstClient from "./CreateFirstClient";

interface NewClientPageProps {
  clientId?: string;
  clientName?: string;
  mode?: 'first' | 'new';
}

const NewClientPage: React.FC<NewClientPageProps> = ({ clientId, clientName, mode }) => {
  const navigate = useNavigate();
  const { clients, isLoading: storeLoading } = useClientStore();
  const currentUserId = getCurrentUserId();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [notFoundError, setNotFoundError] = useState(false);
  
  // Get client from live store data instead of local state
  const clientData = React.useMemo(() => {
    if (mode === 'first') {
      // Return the first available client for the current user
      return clients.find(client => client.userId === currentUserId);
    }
    if (mode === 'new') {
      // Return null for new client mode
      return null;
    }
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
  }, [clients, clientId, clientName, currentUserId, mode]);
  
  useEffect(() => {
    console.log("🔄 === NewClientPage: Effect triggered ===");
    console.log("🎯 Mode:", mode);
    console.log("🎯 Target Client ID:", clientId);
    console.log("📝 Target Client Name:", clientName);
    console.log("👤 Current User ID:", currentUserId);
    console.log("📊 Clients in store:", clients.length);
    console.log("✅ Client found in store:", !!clientData);
    
    if (clientData) {
      console.log("🎉 Client data found:", {
        id: clientData.id,
        name: clientData.name,
        birthStage: clientData.birthStage || 'NOT SET'
      });
    }
    
    // Debug: List all available client IDs in store
    if (clients.length > 0) {
      console.log("📋 Available clients in store:");
      clients.forEach(client => {
        console.log(`   - ${client.name} (ID: ${client.id}, User: ${client.userId})`);
      });
    }
    
    // Handle different modes
    if (mode === 'new') {
      setIsLoading(false);
      setNotFoundError(false);
      return;
    }
    
    if (mode === 'first') {
      if (clients.length > 0) {
        if (clientData) {
          console.log(`🔀 Redirecting to first client: /clients/id/${clientData.id}`);
          navigate(`/clients/id/${clientData.id}`, { replace: true });
          return;
        } else {
          // No clients exist, redirect to create new client
          console.log("🔀 No clients found, redirecting to create new client");
          navigate(`/clients/new`, { replace: true });
          return;
        }
      } else {
        // Still loading clients
        setIsLoading(true);
        return;
      }
    }
    
    // If we have client data from the store, we're done loading
    if (clientData) {
      setIsLoading(false);
      setNotFoundError(false);
      
      // If we found by name and have an ID, redirect to ID-based URL
      if (clientName && clientData.id) {
        console.log(`🔀 Redirecting to ID-based URL: /clients/id/${clientData.id}`);
        navigate(`/clients/id/${clientData.id}`, { replace: true });
        return;
      }
      return;
    }
    
    // If no clients exist at all and store finished loading, redirect to create new client
    if (clients.length === 0 && !mode && !storeLoading) {
      console.log("🔀 No clients exist, redirecting to create new client");
      navigate('/clients/new', { replace: true });
      return;
    }
    
    // If we have clients loaded but no match found, show error
    if (clients.length > 0 && !clientData && !mode) {
      if (retryCount >= 2) {
        console.log("❌ Client not found after maximum retries");
        console.log(`🔍 Searched for ID: ${clientId || 'N/A'}`);
        console.log(`🔍 Searched for name: ${clientName || 'N/A'}`);
        setIsLoading(false);
        setNotFoundError(true);
        return;
      }
      
      // Retry once more in case of timing issues
      console.log(`⏳ Client not found, retrying (${retryCount + 1}/3)`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
      return;
    }
    
    // Still waiting for clients to load
    if (clients.length === 0 && !mode) {
      console.log("⏳ Still waiting for clients to load from Firestore...");
    }
    setIsLoading(true);
    setNotFoundError(false);
  }, [clientId, clientName, currentUserId, clients, clientData, retryCount, navigate, mode, storeLoading]);
  
  // Handle new client mode
  if (mode === 'new') {
    return <CreateFirstClient />;
  }

  // Add error boundary logic
  if (notFoundError || (!clientData && !isLoading && !mode)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Client Not Found</h2>
          <p className="text-gray-700 mb-4">
            {clientId ? (
              <>We couldn't find a client with ID: <strong>{clientId}</strong></>
            ) : (
              <>We couldn't find the client: <strong>{decodeURIComponent(clientName || "")}</strong></>
            )}
          </p>
          <div className="text-sm text-gray-600 mb-4 text-left">
            <p className="font-medium mb-2">Possible causes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Client document doesn't exist in Firestore</li>
              <li>Client belongs to a different user</li>
              <li>Firestore security rules blocking access</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Link 
              to="/clients" 
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Return to clients list
            </Link>
            <Link 
              to="/clients/new" 
              className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Create new client
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Reload page
            </button>
          </div>
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

  return (
    <>
      <ClientPageTemplate clientInfo={clientInfo} />
      <ClientDebugPanel />
    </>
  );
};

export default NewClientPage;
