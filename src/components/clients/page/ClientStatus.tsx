
import React from "react";
import { ClientData } from "../types/ClientTypes";
import ClientDetailsSection from "./ClientDetailsSection";
import ClientStageToggle from "./ClientStageToggle";
import PostpartumNotes from "./PostpartumNotes";
interface ClientStatusProps {
  dueDateLabel: string;
  client: ClientData;
}

const ClientStatus: React.FC<ClientStatusProps> = ({ dueDateLabel, client }) => {
  return (
    <div className="space-y-4">
      <ClientDetailsSection client={client} />
      
      <div className="pb-2 px-2">
        <ClientStageToggle client={client} />
      </div>

      {/* Show PostpartumNotes right below stage section when delivered */}
      {client.birthStage === 'delivered' && (
        <PostpartumNotes client={client} />
      )}
    </div>
  );
};

export default ClientStatus;
