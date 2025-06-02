import { ClientData } from '../../types/ClientTypes';
import { clients } from '../clientStore';
import { getCurrentUserId, notifyClientsChanged } from '../clientSubscriptions';
import { saveClientToFirestore, deleteClientFromFirestore } from '../firebase/firebaseUtils';
import { v4 as uuidv4 } from 'uuid';

export const addClient = async (client: ClientData): Promise<ClientData> => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot add client - user not authenticated");
  }
  
  console.log("=== ADDING CLIENT TO FIREBASE ===");
  console.log("User ID:", userId);
  console.log("Client data:", client);
  
  // Ensure the client has the current user's ID and a unique ID
  if (!client.status) client.status = "active";
  
  // Always set createdAt to current timestamp when adding a new client
  client.createdAt = new Date().toISOString();
  console.log(`Setting createdAt for new client ${client.name}: ${client.createdAt}`);
  
  // Generate a unique ID if not provided
  if (!client.id) {
    client.id = `client-${uuidv4()}`;
  }
  
  client.userId = userId;
  
  try {
    // Add to Firestore first
    await saveClientToFirestore(client);
    
    // Update local array
    clients.unshift(client);
    
    // Notify listeners
    notifyClientsChanged();
    
    console.log(`Successfully added client ${client.name} locally`);
    return client;
  } catch (error) {
    console.error("❌ Error adding client:", error);
    throw error;
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
    await saveClientToFirestore(updatedClient);
    
    // Update local array
    clients[clientIndex] = updatedClient;
    notifyClientsChanged();
    
    console.log(`Successfully updated client ${updatedClient.name}`);
  } catch (error) {
    console.error("Error updating client in Firestore:", error);
    throw new Error(`Failed to update client: ${error.message}`);
  }
};

export const deleteClient = async (clientId: string, reason: string) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot delete client - user not authenticated");
  }
  
  try {
    // Remove from Firestore first
    await deleteClientFromFirestore(clientId);
    
    // Remove from local array
    const clientIndex = clients.findIndex(client => client.id === clientId);
    if (clientIndex !== -1) {
      clients.splice(clientIndex, 1);
      notifyClientsChanged();
    }
    
    console.log(`Successfully deleted client ${clientId}`);
  } catch (error) {
    console.error(`Error deleting client ${clientId}:`, error);
    throw error;
  }
};
