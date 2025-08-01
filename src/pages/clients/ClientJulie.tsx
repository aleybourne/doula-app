
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";
import { getClientAvatarUrl } from "@/utils/assetMigration";

const ClientJulie: React.FC = () => {
  const clientInfo = {
    id: "julie-hill-static", // Added ID property
    name: "Julie Hill",
    image: getClientAvatarUrl("Julie Hill"),
    dueDateISO: "2025-06-19",
    dueDateLabel: "June 19th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Julie Hill"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientJulie;
