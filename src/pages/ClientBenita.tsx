
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";
import { getClientAvatarUrl } from "@/utils/assetMigration";

const ClientBenita: React.FC = () => {
  const clientInfo = {
    id: "benita-mendez-static", // Added ID property
    name: "Benita Mendez",
    image: getClientAvatarUrl("Benita Mendez"),
    dueDateISO: "2025-08-07",
    dueDateLabel: "August 7th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Benita Mendez"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientBenita;
