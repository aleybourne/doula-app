
import { ClientData, ClientStatus } from '../../types/ClientTypes';
import { clients } from '../clientStore';
import { getCurrentUserId, notifyClientsChanged } from '../clientSubscriptions';
import { saveClientToFirestore } from '../firebase/firebaseUtils';
import { addWeeks } from 'date-fns';
import { POSTPARTUM_WEEKS } from '../../utils/gestationUtils';

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
  
  if (status === 'archived') {
    const dueDate = new Date(clients[clientIndex].dueDateISO);
    const postpartumEndDate = new Date(dueDate);
    postpartumEndDate.setDate(dueDate.getDate() + 42);
    updatedClient.postpartumDate = postpartumEndDate.toISOString();
  }
  
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

export const markClientDelivered = async (clientId: string, deliveryDate: Date) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot mark client delivered - user not authenticated");
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === clientId && client.userId === userId
  );
  
  if (clientIndex === -1) {
    throw new Error(`Client ${clientId} not found or access denied`);
  }
  
  const postpartumEndDate = addWeeks(deliveryDate, POSTPARTUM_WEEKS);
  
  const updatedClient = {
    ...clients[clientIndex],
    status: 'delivered' as ClientStatus,
    statusReason: 'Client has delivered',
    statusDate: new Date().toISOString(),
    deliveryDate: deliveryDate.toISOString(),
    postpartumDate: postpartumEndDate.toISOString(),
  };
  
  try {
    console.log(`Marking client ${clientId} as delivered`);
    
    // Update in Firestore first
    await saveClientToFirestore(updatedClient);
    
    // Update local array
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
    
    console.log(`Successfully marked client as delivered`);
  } catch (error) {
    console.error("Error marking client delivered in Firestore:", error);
    throw new Error(`Failed to mark client as delivered: ${error.message}`);
  }
};

export const archiveClient = (clientId: string, reason: string) => {
  return updateClientStatus(clientId, 'archived' as ClientStatus, reason);
};

export const restoreClient = (clientId: string) => {
  return updateClientStatus(clientId, 'active' as ClientStatus, 'Restored from archive');
};
