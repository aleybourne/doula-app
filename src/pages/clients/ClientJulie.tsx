
import React from "react";
import ClientPageTemplate from "@/components/clients/ClientPageTemplate";
import { clientsTags } from "@/components/clients/clientsTagsData";

const ClientJulie: React.FC = () => {
  const clientInfo = {
    name: "Julie Hill",
    image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    dueDateISO: "2025-06-19",
    dueDateLabel: "June 19th",
    bgColor: "bg-[#f9f5f2]",
    tags: clientsTags["Julie Hill"],
  };

  return <ClientPageTemplate clientInfo={clientInfo} />;
};

export default ClientJulie;
