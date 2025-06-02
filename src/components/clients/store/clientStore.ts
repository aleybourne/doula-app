
import { ClientData } from '../types/ClientTypes';
import { loadClientsFromFirestore, testFirebaseConnection } from './firebase/firebaseUtils';
import { getCurrentUserId, subscribeToClientChanges, notifyClientsChanged } from './clientSubscriptions';

// Re-export functions from clientSubscriptions
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
    console.log(`Current user ID: ${userId}`);
    
    await testFirebaseConnection();
    const firestoreClients = await loadClientsFromFirestore(userId);
    
    console.log(`Loaded ${firestoreClients.length} clients for user ${userId}`);
    
    // Debug: Log client-user associations
    firestoreClients.forEach((client, index) => {
      console.log(`Client ${index + 1}: ${client.name}, userId: ${client.userId}, matches current user: ${client.userId === userId}`);
    });
    
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
      const currentUserId = getCurrentUserId();
      console.log(`Found client ${client.name} with userId: ${client.userId}, current user: ${currentUserId}`);
      
      // Verify the client belongs to the current user
      if (client.userId !== currentUserId) {
        console.warn(`Access denied: Client ${clientId} belongs to user ${client.userId}, current user is ${currentUserId}`);
        return null;
      }
      
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
    
    // Debug: Check user associations
    debugClientUserAssociations();
    
    notifyClientsChanged();
  } catch (error) {
    console.error("Error loading clients:", error);
    throw error;
  }
};

// Debug function to check client-user associations
export const debugClientUserAssociations = () => {
  const currentUserId = getCurrentUserId();
  console.log("=== CLIENT-USER ASSOCIATION DEBUG ===");
  console.log(`Current user ID: ${currentUserId}`);
  console.log(`Total clients in memory: ${clients.length}`);
  
  clients.forEach((client, index) => {
    console.log(`${index + 1}. ${client.name}:`);
    console.log(`   - Client ID: ${client.id}`);
    console.log(`   - User ID: ${client.userId || 'MISSING'}`);
    console.log(`   - Belongs to current user: ${client.userId === currentUserId}`);
    console.log(`   - Created: ${client.createdAt || 'Unknown'}`);
  });
  
  const userClients = clients.filter(client => client.userId === currentUserId);
  console.log(`Clients belonging to current user: ${userClients.length}`);
  console.log("=== END DEBUG ===");
};
