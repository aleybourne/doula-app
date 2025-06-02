
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
    console.log(`=== LOADING CLIENTS FROM NEW FIRESTORE STRUCTURE ===`);
    console.log(`Current user ID: ${userId}`);
    console.log(`Using path: clients/${userId}/clients`);
    
    await testFirebaseConnection();
    const firestoreClients = await loadClientsFromFirestore(userId);
    
    console.log(`Loaded ${firestoreClients.length} clients for user ${userId} from new structure`);
    
    // Debug: Log client-user associations
    firestoreClients.forEach((client, index) => {
      console.log(`Client ${index + 1}: ${client.name}, userId: ${client.userId}, matches current user: ${client.userId === userId}`);
    });
    
    return firestoreClients;
  } catch (error) {
    console.error(`❌ Failed to load clients from new Firestore structure for user ${userId}:`, error);
    throw error;
  }
};

export const getClientById = async (clientId: string): Promise<ClientData | null> => {
  try {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      console.warn("Cannot get client by ID - no authenticated user");
      return null;
    }

    const { getClientFromFirestore } = await import('./firebase/firebaseUtils');
    const client = await getClientFromFirestore(clientId, currentUserId);
    
    if (client) {
      console.log(`Found client ${client.name} with userId: ${client.userId}, current user: ${currentUserId}`);
      return client;
    }
    
    // Check local clients array if not found in Firestore
    const foundClient = clients.find(client => client.id === clientId && client.userId === currentUserId);
    return foundClient || null;
  } catch (error) {
    console.error(`Failed to get client with ID ${clientId}:`, error);
    
    // Check local clients array if Firestore fails
    const currentUserId = getCurrentUserId();
    const foundClient = clients.find(client => client.id === clientId && client.userId === currentUserId);
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
    console.log("Loading clients for current user from new data structure...");
    const loadedClients = await initializeClients();
    clients.length = 0;
    clients.push(...loadedClients);
    console.log(`Loaded ${clients.length} clients for current user from new structure`);
    
    // Debug: Check user associations
    debugClientUserAssociations();
    
    notifyClientsChanged();
  } catch (error) {
    console.error("Error loading clients from new structure:", error);
    throw error;
  }
};

// Debug function to check client-user associations
export const debugClientUserAssociations = () => {
  const currentUserId = getCurrentUserId();
  console.log("=== CLIENT-USER ASSOCIATION DEBUG (NEW STRUCTURE) ===");
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
