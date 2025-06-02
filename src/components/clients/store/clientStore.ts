
import { ClientData, ClientChangeListener } from '../types/ClientTypes';
import { cleanupClientImageData } from '../utils/storageUtils';
import { db, auth } from '../../../config/firebase';
import { collection, query, where, getDocs, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Get the current user ID from Firebase Auth
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

// Initialize clients for a specific user
export const initializeClients = async (): Promise<ClientData[]> => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    console.warn("No authenticated user found, returning empty client list");
    return [];
  }

  try {
    console.log(`Loading clients for user: ${userId}`);
    
    // Get clients from Firestore
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const firestoreClients = querySnapshot.docs.map(doc => {
        const data = doc.data() as ClientData;
        console.log(`Loaded client from Firestore: ${data.name}, createdAt: ${data.createdAt}`);
        return data;
      });
      console.log(`Found ${firestoreClients.length} clients in Firestore`);
      return firestoreClients;
    } else {
      console.log("No clients found in Firestore, new user starts with empty client list");
      return [];
    }
  } catch (error) {
    console.error(`Failed to load clients from Firestore for user ${userId}:`, error);
    throw error; // Re-throw to let the calling code handle it
  }
};

// Find a client by ID
export const getClientById = async (clientId: string): Promise<ClientData | null> => {
  try {
    const clientDocRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientDocRef);
    
    if (clientDoc.exists()) {
      return clientDoc.data() as ClientData;
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

// Find a client by name (legacy support)
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

export let clients: ClientData[] = []; // Start empty and populate in the useEffect below

// Save clients to Firestore (primary storage)
export const saveClientsToStorage = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot save clients - no authenticated user found");
    throw new Error("User not authenticated");
  }
  
  try {
    console.log(`Saving ${clients.length} clients to Firestore for user: ${userId}`);
    
    const batch = [];
    for (const client of clients) {
      if (!client.userId) {
        client.userId = userId;
      }
      
      // Ensure client has an ID
      if (!client.id) {
        client.id = `client-${client.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      }
      
      const clientDocRef = doc(db, 'clients', client.id);
      batch.push(setDoc(clientDocRef, client));
    }
    
    await Promise.all(batch);
    console.log("Successfully saved all clients to Firestore");
  } catch (error) {
    console.error(`Failed to save clients to Firestore for user ${userId}:`, error);
    throw error;
  }
};

export const clientsChangeListeners: Array<ClientChangeListener> = [];

export const notifyClientsChanged = () => {
  // Don't automatically save here to avoid loops - let individual actions handle their own saves
  clientsChangeListeners.forEach(listener => listener());
};

let firestoreUnsubscribe: (() => void) | null = null;

export const subscribeToClientChanges = (callback: ClientChangeListener): (() => void) => {
  clientsChangeListeners.push(callback);
  
  // Set up Firestore real-time listener if not already set up
  const userId = getCurrentUserId();
  
  if (userId && !firestoreUnsubscribe) {
    console.log("Setting up Firestore real-time listener for user:", userId);
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('userId', '==', userId));
    
    firestoreUnsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore snapshot received, updating clients");
      
      if (!snapshot.empty) {
        const firestoreClients = snapshot.docs.map(doc => {
          const data = doc.data() as ClientData;
          console.log(`Real-time update - client: ${data.name}, createdAt: ${data.createdAt}`);
          return data;
        });
        
        console.log(`Real-time listener found ${firestoreClients.length} clients`);
        
        // Update local clients array
        clients.length = 0;
        clients.push(...firestoreClients);
        
        // Notify all listeners
        clientsChangeListeners.forEach(listener => listener());
      } else {
        console.log("Real-time listener: No clients found");
        // If snapshot is empty, clear local clients array
        clients.length = 0;
        clientsChangeListeners.forEach(listener => listener());
      }
    }, (error) => {
      console.error("Error in Firestore client subscription:", error);
    });
  }
  
  // Return function to unsubscribe from local listener only
  return () => {
    const index = clientsChangeListeners.indexOf(callback);
    if (index !== -1) {
      clientsChangeListeners.splice(index, 1);
    }
    
    // Only unsubscribe from Firestore if no more listeners
    if (clientsChangeListeners.length === 0 && firestoreUnsubscribe) {
      console.log("Cleaning up Firestore listener");
      firestoreUnsubscribe();
      firestoreUnsubscribe = null;
    }
  };
};

// Load clients when user changes
export const loadClientsForCurrentUser = async () => {
  try {
    console.log("Loading clients for current user...");
    const loadedClients = await initializeClients();
    clients.length = 0; // Clear the array
    clients.push(...loadedClients); // Add the loaded clients
    console.log(`Loaded ${clients.length} clients for current user`);
    
    // Don't call notifyClientsChanged here to avoid triggering save immediately
    clientsChangeListeners.forEach(listener => listener());
  } catch (error) {
    console.error("Error loading clients:", error);
    throw error;
  }
};
