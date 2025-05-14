
import React from "react";
import { ClientData } from "../types/ClientTypes";
import ClientCard from "../ClientCard";
import { calculateGestationAndTrimester } from "../utils/gestationUtils";

interface ActiveClientItemProps {
  client: ClientData;
  onClick: (clientName: string) => void;
}

const ActiveClientItem: React.FC<ActiveClientItemProps> = ({ client, onClick }) => {
  const { 
    gestation, 
    trimester, 
    isPastDue, 
    progress, 
    isPostpartum, 
    postpartumProgress 
  } = calculateGestationAndTrimester(
    client.dueDateISO, 
    client.status, 
    client.deliveryDate
  );
  
  return (
    <ClientCard
      key={`${client.name}`}
      name={client.name}
      dueDateLabel={client.dueDateLabel}
      gestation={gestation}
      trimester={trimester}
      image={client.image}
      accent={client.accent}
      progress={progress}
      isPastDue={isPastDue}
      isPostpartum={isPostpartum}
      postpartumProgress={postpartumProgress}
      status={client.status}
      onClick={() => onClick(client.name)}
    />
  );
};

export default ActiveClientItem;
