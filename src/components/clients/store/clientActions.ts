
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
    throw new Error("Cannot add client - user not authenticated");
  }
  
  // Ensure the client has the current user's ID and a unique ID
  if (!client.status) client.status = "active" as ClientStatus;
  
  // Always set createdAt to current timestamp when adding a new client
  client.createdAt = new Date().toISOString();
  console.log(`Setting createdAt for new client ${client.name}: ${client.createdAt}`);
  
  // Generate a unique ID if not provided
  if (!client.id) {
    client.id = `client-${uuidv4()}`;
  }
  
  client.userId = userId;
  
  try {
    console.log(`Adding client ${client.name} to Firestore with createdAt: ${client.createdAt}`);
    
    // Add to Firestore first
    const clientDocRef = doc(db, 'clients', client.id);
    await setDoc(clientDocRef, client);
    
    // Update local array
    clients.unshift(client);
    
    // Notify listeners
    notifyClientsChanged();
    
    console.log(`Successfully added client ${client.name}`);
    return client;
  } catch (error) {
    console.error("Error adding client to Firestore:", error);
    throw new Error(`Failed to add client: ${error.message}`);
  }
};

export const updateClient = async (updatedClient: ClientData) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot update client - user not authenticated");
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === updatedClient.id && client.userId === userId
  );
  
  if (clientIndex === -1) {
    throw new Error(`Client ${updatedClient.id} not found or access denied`);
  }
  
  // Ensure we keep the userId in the updated client
  updatedClient.userId = userId;
  
  try {
    console.log(`Updating client ${updatedClient.name} in Firestore`);
    
    // Update in Firestore first
    const clientDocRef = doc(db, 'clients', updatedClient.id);
    await setDoc(clientDocRef, updatedClient);
    
    // Update local array
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
    
    console.log(`Successfully updated client ${updatedClient.name}`);
  } catch (error) {
    console.error("Error updating client in Firestore:", error);
    throw new Error(`Failed to update client: ${error.message}`);
  }
};

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
    const clientDocRef = doc(db, 'clients', clientId);
    await setDoc(clientDocRef, updatedClient);
    
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
    const clientDocRef = doc(db, 'clients', clientId);
    await setDoc(clientDocRef, updatedClient);
    
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

export const deleteClient = async (clientId: string, reason: string) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot delete client - user not authenticated");
  }
  
  try {
    console.log(`Deleting client ${clientId} from Firestore`);
    
    // Remove from Firestore first
    const clientDocRef = doc(db, 'clients', clientId);
    await deleteDoc(clientDocRef);
    
    // Remove from local array
    const clientIndex = clients.findIndex(client => client.id === clientId);
    if (clientIndex !== -1) {
      clients.splice(clientIndex, 1);
      notifyClientsChanged();
    }
    
    console.log(`Successfully deleted client ${clientId}`);
  } catch (error) {
    console.error(`Error deleting client ${clientId} from Firestore:`, error);
    throw new Error(`Failed to delete client: ${error.message}`);
  }
};

export const restoreClient = (clientId: string) => {
  return updateClientStatus(clientId, 'active' as ClientStatus, 'Restored from archive');
};
