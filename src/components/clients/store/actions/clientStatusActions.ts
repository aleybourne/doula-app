
import { ClientData, ClientStatus } from '../../types/ClientTypes';
import { clients } from '../clientStore';
import { getCurrentUserId, notifyClientsChanged } from '../clientSubscriptions';
import { saveClientToFirestore } from '../firebase/firebaseUtils';

export const updateClientStatus = async (clientId: string, status: ClientData['status'], reason: string): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot update client status - user not authenticated");
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === clientId && client.userId === userId
  );
  
  if (clientIndex === -1) {
    throw new Error(`Client ${clientId} not found or access denied`);
  }
  
  const currentDate = new Date();
  const updatedClient = {
    ...clients[clientIndex],
    status,
    statusReason: reason,
    statusDate: currentDate.toISOString(),
  };
  
  try {
    console.log(`Updating client ${clientId} status to ${status}`);
    
    // Update in Firestore first
    await saveClientToFirestore(updatedClient);
    
    // Update local array
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
    
    console.log(`Successfully updated client status`);
  } catch (error) {
    console.error("Error updating client status in Firestore:", error);
    throw new Error(`Failed to update client status: ${error.message}`);
  }
};
