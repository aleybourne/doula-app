
import React from "react";
import { ClientData } from "../types/ClientTypes";
import ArchivedClientItem from "./ArchivedClientItem";

interface ArchivedClientListProps {
  clients: ClientData[];
  onRestore: (clientName: string, event: React.MouseEvent) => void;
  onCardClick: (clientName: string) => void;
}

const ArchivedClientList: React.FC<ArchivedClientListProps> = ({
  clients,
  onRestore,
  onCardClick
}) => {
  return (
    <>
      <h2 className="text-lg font-medium mb-2 text-gray-700">Archived Clients</h2>
      {clients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No archived clients.
        </div>
      ) : (
        clients.map((client, index) => (
          <ArchivedClientItem 
            key={`${client.name}-${index}`}
            client={client}
            onRestore={onRestore}
            onCardClick={onCardClick}
          />
        ))
      )}
    </>
  );
};

export default ArchivedClientList;
