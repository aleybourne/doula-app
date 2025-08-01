
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";
import { getClientAvatarUrl } from "@/utils/assetMigration";

const ClientSam: React.FC = () => {
  const clientInfo = {
    id: "sam-williams-static", // Added ID property
    name: "Sam Williams",
    image: getClientAvatarUrl("Sam Williams"),
    dueDateISO: "2025-10-16",
    dueDateLabel: "October 16th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Sam Williams"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientSam;
