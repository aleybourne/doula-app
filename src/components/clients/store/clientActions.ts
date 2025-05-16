
import { ClientData, ClientStatus } from '../types/ClientTypes';
import { clients, notifyClientsChanged, getCurrentUserId } from './clientStore';
import { addWeeks } from 'date-fns';
import { POSTPARTUM_WEEKS } from '../utils/gestationUtils';
import { db } from '../../../config/firebase';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const addClient = async (client: ClientData) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot add client - user not logged in");
    return;
  }
  
  // Ensure the client has the current user's ID
  if (!client.status) client.status = "active" as ClientStatus;
  if (!client.createdAt) {
    client.createdAt = new Date().toISOString();
  }
  client.userId = userId;
  
  // Add to Firestore
  try {
    const clientDocRef = doc(db, 'clients', `${userId}_${client.name}`);
    await setDoc(clientDocRef, client);
    
    // Also update local array
    clients.unshift(client);
    notifyClientsChanged();
  } catch (error) {
    console.error("Error adding client to Firestore:", error);
    // Add to local array anyway to ensure UI updates
    clients.unshift(client);
    notifyClientsChanged();
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
    client.name === updatedClient.name && client.userId === userId
  );
  
  if (clientIndex !== -1) {
    // Ensure we keep the userId in the updated client
    updatedClient.userId = userId;
    
    try {
      // Update in Firestore
      const clientDocRef = doc(db, 'clients', `${userId}_${updatedClient.name}`);
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
    console.warn(`Client ${updatedClient.name} not found or doesn't belong to current user`);
  }
};

export const updateClientStatus = async (clientName: string, status: ClientData['status'], reason: string): Promise<void> => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot update client status - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.name === clientName && client.userId === userId
  );
  
  if (clientIndex === -1) {
    console.error(`Client ${clientName} not found or doesn't belong to current user`);
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
    const clientDocRef = doc(db, 'clients', `${userId}_${clientName}`);
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

export const markClientDelivered = async (clientName: string, deliveryDate: Date) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot mark client delivered - user not logged in");
    return;
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.name === clientName && client.userId === userId
  );
  
  if (clientIndex === -1) {
    console.error(`Client ${clientName} not found or doesn't belong to current user`);
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
    const clientDocRef = doc(db, 'clients', `${userId}_${clientName}`);
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

export const archiveClient = (clientName: string, reason: string) => {
  updateClientStatus(clientName, 'archived' as ClientStatus, reason);
};

export const deleteClient = async (clientName: string, reason: string) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot delete client - user not logged in");
    return;
  }
  
  // First mark as deleted in the local array
  updateClientStatus(clientName, 'deleted' as ClientStatus, reason);
  
  // Attempt to remove from Firestore
  try {
    const clientDocRef = doc(db, 'clients', `${userId}_${clientName}`);
    await deleteDoc(clientDocRef);
  } catch (error) {
    console.error(`Error deleting client ${clientName} from Firestore:`, error);
  }
};

export const restoreClient = (clientName: string) => {
  updateClientStatus(clientName, 'active' as ClientStatus, 'Restored from archive');
};
