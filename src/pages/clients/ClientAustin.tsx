
import React, { useEffect } from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";
import { useClientStore } from "@/components/clients/hooks/useClientStore";

const ClientAustin: React.FC = () => {
  const { clients, updateClient } = useClientStore();
  
  // Find the client data from the clients array
  const clientData = clients.find(client => client.name.startsWith("Austin"));
  
  // For debugging purposes
  useEffect(() => {
    console.log("Client data loaded:", clientData);
  }, [clientData]);
  
  if (!clientData) {
    return <div>Client not found</div>;
  }

  const clientInfo = {
    ...clientData, // Spread all client data including ID
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Austin Leybourne"] || [],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientAustin;
