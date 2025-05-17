
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";

const ClientJasmine: React.FC = () => {
  const clientInfo = {
    id: "jasmine-jones-static", // Added ID property
    name: "Jasmine Jones",
    image: "/lovable-uploads/edc4d06e-95d5-4730-b269-d713d7bd57f1.png",
    dueDateISO: "2025-05-15",
    dueDateLabel: "May 15th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Jasmine Jones"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientJasmine;
