
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";

const ClientSam: React.FC = () => {
  const clientInfo = {
    id: "sam-williams-static", // Added ID property
    name: "Sam Williams",
    image: "/lovable-uploads/22335ae2-dde6-4f2a-8c5e-4126a65f2590.png",
    dueDateISO: "2025-10-16",
    dueDateLabel: "October 16th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Sam Williams"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientSam;
