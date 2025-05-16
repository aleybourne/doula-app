
import { ClientData, ClientStatus } from '../types/ClientTypes';
import { clients, notifyClientsChanged, getCurrentUserId } from './clientStore';
import { addWeeks } from 'date-fns';
import { POSTPARTUM_WEEKS } from '../utils/gestationUtils';
import { db } from '../../../config/firebase';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export const addClient = async (client: ClientData): Promise<ClientData> => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot add client - user not logged in");
    return Promise.reject("User not logged in");
  }
  
  // Ensure the client has the current user's ID and a unique ID
  if (!client.status) client.status = "active" as ClientStatus;
  if (!client.createdAt) {
    client.createdAt = new Date().toISOString();
  }
  
  // Generate a unique ID if not provided
  if (!client.id) {
    client.id = `client-${uuidv4()}`;
  }
  
  client.userId = userId;
  
  // Add to Firestore
  try {
    // Use client's ID for document ID
    const clientDocRef = doc(db, 'clients', client.id);
    await setDoc(clientDocRef, client);
    
    // Also update local array
    clients.unshift(client);
    notifyClientsChanged();
    
    return client; // Return the client object after successful addition
  } catch (error) {
    console.error("Error adding client to Firestore:", error);
    // Add to local array anyway to ensure UI updates
    clients.unshift(client);
    notifyClientsChanged();
    return client; // Still return the client even if Firestore update fails
  }
};

export const updateClient = async (updatedClient: ClientData) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot update client - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === updatedClient.id && client.userId === userId
  );
  
  if (clientIndex !== -1) {
    // Ensure we keep the userId in the updated client
    updatedClient.userId = userId;
    
    try {
      // Update in Firestore
      const clientDocRef = doc(db, 'clients', updatedClient.id);
      await setDoc(clientDocRef, updatedClient);
      
      // Also update local array
      clients[clientIndex] = updatedClient;
      notifyClientsChanged();
    } catch (error) {
      console.error("Error updating client in Firestore:", error);
      // Update local array anyway to ensure UI updates
      clients[clientIndex] = updatedClient;
      notifyClientsChanged();
    }
  } else {
    console.warn(`Client ${updatedClient.id} not found or doesn't belong to current user`);
  }
};

export const updateClientStatus = async (clientId: string, status: ClientData['status'], reason: string): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot update client status - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === clientId && client.userId === userId
  );
  
  if (clientIndex === -1) {
    console.error(`Client ${clientId} not found or doesn't belong to current user`);
    return;
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
    // Update in Firestore
    const clientDocRef = doc(db, 'clients', clientId);
    await setDoc(clientDocRef, updatedClient);
    
    // Also update local array
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
  } catch (error) {
    console.error("Error updating client status in Firestore:", error);
    // Update local array anyway to ensure UI updates
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
  }
};

export const markClientDelivered = async (clientId: string, deliveryDate: Date) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot mark client delivered - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === clientId && client.userId === userId
  );
  
  if (clientIndex === -1) {
    console.error(`Client ${clientId} not found or doesn't belong to current user`);
    return;
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
    // Update in Firestore
    const clientDocRef = doc(db, 'clients', clientId);
    await setDoc(clientDocRef, updatedClient);
    
    // Also update local array
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
  } catch (error) {
    console.error("Error marking client delivered in Firestore:", error);
    // Update local array anyway to ensure UI updates
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
  }
};

export const archiveClient = (clientId: string, reason: string) => {
  updateClientStatus(clientId, 'archived' as ClientStatus, reason);
};

export const deleteClient = async (clientId: string, reason: string) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot delete client - user not logged in");
    return;
  }
  
  // First mark as deleted in the local array
  updateClientStatus(clientId, 'deleted' as ClientStatus, reason);
  
  // Attempt to remove from Firestore
  try {
    const clientDocRef = doc(db, 'clients', clientId);
    await deleteDoc(clientDocRef);
  } catch (error) {
    console.error(`Error deleting client ${clientId} from Firestore:`, error);
  }
};

export const restoreClient = (clientId: string) => {
  updateClientStatus(clientId, 'active' as ClientStatus, 'Restored from archive');
};
