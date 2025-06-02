
import { ClientData } from '../types/ClientTypes';
import { loadClientsFromFirestore, testFirebaseConnection } from './firebase/firebaseUtils';
import { getCurrentUserId, subscribeToClientChanges, clientsChangeListeners, notifyClientsChanged } from './clientSubscriptions';

export { getCurrentUserId, subscribeToClientChanges, notifyClientsChanged };

export let clients: ClientData[] = [];

export const initializeClients = async (): Promise<ClientData[]> => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    console.warn("No authenticated user found, returning empty client list");
    return [];
  }

  try {
    console.log(`=== LOADING CLIENTS FROM FIRESTORE ===`);
    
    await testFirebaseConnection();
    const firestoreClients = await loadClientsFromFirestore(userId);
    
    return firestoreClients;
  } catch (error) {
    console.error(`❌ Failed to load clients from Firestore for user ${userId}:`, error);
    throw error;
  }
};

export const getClientById = async (clientId: string): Promise<ClientData | null> => {
  try {
    const { getClientFromFirestore } = await import('./firebase/firebaseUtils');
    const client = await getClientFromFirestore(clientId);
    
    if (client) {
      return client;
    }
    
    // Check local clients array if not found in Firestore
    const foundClient = clients.find(client => client.id === clientId);
    return foundClient || null;
  } catch (error) {
    console.error(`Failed to get client with ID ${clientId}:`, error);
    
    // Check local clients array if Firestore fails
    const foundClient = clients.find(client => client.id === clientId);
    return foundClient || null;
  }
};

export const getClientByName = (clientName: string): ClientData | null => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return null;
  
  const normalizedSearchName = decodeURIComponent(clientName).toLowerCase().replace(/\s+/g, ' ').trim();
  
  return clients.find(client => {
    if (client.userId !== currentUserId) return false;
    
    const normalizedClientName = client.name.toLowerCase().replace(/\s+/g, ' ').trim();
    return normalizedClientName === normalizedSearchName;
  }) || null;
};

export const loadClientsForCurrentUser = async () => {
  try {
    console.log("Loading clients for current user...");
    const loadedClients = await initializeClients();
    clients.length = 0;
    clients.push(...loadedClients);
    console.log(`Loaded ${clients.length} clients for current user`);
    
    clientsChangeListeners.forEach(listener => listener());
  } catch (error) {
    console.error("Error loading clients:", error);
    throw error;
  }
};
