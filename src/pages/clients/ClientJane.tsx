
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";

const ClientJane: React.FC = () => {
  const clientInfo = {
    id: "jane-miller-static", // Added ID property
    name: "Jane Miller",
    image: "/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png",
    dueDateISO: "2025-03-19",
    dueDateLabel: "March 19th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Jane Miller"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientJane;
