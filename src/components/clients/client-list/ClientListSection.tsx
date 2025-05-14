
import React from "react";
import { ClientData } from "../types/ClientTypes";
import ActiveClientItem from "./ActiveClientItem";

interface ClientListSectionProps {
  title: string;
  clients: ClientData[];
  filter?: string;
  onCardClick: (clientName: string) => void;
  emptyMessage: string;
}

const ClientListSection: React.FC<ClientListSectionProps> = ({
  title,
  clients,
  onCardClick,
  emptyMessage
}) => {
  return (
    <>
      <h2 className="text-lg font-medium mb-2 text-gray-700">{title}</h2>
      {clients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        clients.map((client, index) => (
          <ActiveClientItem 
            key={`${client.name}-${index}`}
            client={client} 
            onClick={onCardClick} 
          />
        ))
      )}
    </>
  );
};

export default ClientListSection;
