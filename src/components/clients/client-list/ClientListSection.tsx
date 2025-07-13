
import React from "react";
import { ClientData } from "../types/ClientTypes";
import ActiveClientItem from "./ActiveClientItem";
import EmptyClientsList from "../EmptyClientsList";

interface ClientListSectionProps {
  title: string;
  clients: ClientData[];
  filter?: string;
  onCardClick: (clientId: string) => void;
  emptyMessage?: string;
  showEmptyState?: boolean;
}

const ClientListSection: React.FC<ClientListSectionProps> = ({
  title,
  clients,
  onCardClick,
  emptyMessage,
  showEmptyState = false,
}) => {
  if (clients.length === 0) {
    if (showEmptyState) {
      return <EmptyClientsList />;
    }
    if (emptyMessage) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-2 text-gray-700">{title}</h2>
      <div className="space-y-3">
        {clients.map((client) => (
          <ActiveClientItem 
            key={client.id}
            client={client} 
            onClick={() => onCardClick(client.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ClientListSection;
