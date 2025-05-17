
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";

const ClientBenita: React.FC = () => {
  const clientInfo = {
    id: "benita-mendez-static", // Added ID property
    name: "Benita Mendez",
    image: "/lovable-uploads/7f8dd16b-5f65-43a5-9f38-e0a45d63a63b.png",
    dueDateISO: "2025-08-07",
    dueDateLabel: "August 7th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Benita Mendez"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientBenita;
