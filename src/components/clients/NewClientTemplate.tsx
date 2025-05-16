
import React, { useEffect } from "react";
import ClientPageTemplate from "./ClientPageTemplate";
import { clientsTags } from "./clientsTagsData";
import { useClientStore } from "./clientsData";
import { getCurrentUserId } from "./store/clientStore";

interface NewClientPageProps {
  clientName: string;
}

const NewClientPage: React.FC<NewClientPageProps> = ({ clientName }) => {
  const { clients } = useClientStore();
  const currentUserId = getCurrentUserId();
  
  // Find client data from user's clients
  const clientData = clients.find(client => {
    // Only include clients that belong to this user
    if (client.userId !== currentUserId) {
      return false;
    }
    
    // Normalize both strings for comparison
    const normalizedName = client.name.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedSearch = decodeURIComponent(clientName).toLowerCase().replace(/\s+/g, ' ').trim();
    return normalizedName === normalizedSearch;
  });
  
  useEffect(() => {
    if (clientData) {
      console.log("Found client data:", clientData);
    } else {
      console.error(`Client not found: '${decodeURIComponent(clientName)}'`);
      console.log("Available clients:", clients.map(c => `'${c.name}'`).join(", "));
    }
  }, [clientName, clientData, clients]);
  
  if (!clientData) {
    return <div>Client not found: {decodeURIComponent(clientName)}</div>;
  }

  const clientInfo = {
    ...clientData, // Spread all client data to include all fields
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags[clientData.name] || [],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default NewClientPage;
