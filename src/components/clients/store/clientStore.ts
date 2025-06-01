
import { ClientData, ClientChangeListener } from '../types/ClientTypes';
import { cleanupClientImageData } from '../utils/storageUtils';
import { db, auth } from '../../../config/firebase';
import { collection, query, where, getDocs, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const defaultClients: ClientData[] = [
  {
    id: "client-benita-mendez",
    name: "Benita Mendez",
    dueDateISO: "2025-08-07",
    dueDateLabel: "August 7th, 2025",
    image: "/lovable-uploads/e9d97597-731d-448a-851d-a7aa29638d42.png",
    status: "active",
    createdAt: "2025-04-07T00:00:00.000Z",
  },
  {
    id: "client-sam-williams",
    name: "Sam Williams",
    dueDateISO: "2025-10-16",
    dueDateLabel: "October 16th, 2025",
    image: "/lovable-uploads/22335ae2-dde6-4f2a-8c5e-4126a65f2590.png",
    status: "active",
    createdAt: "2025-05-14T00:00:00.000Z",
  },
  {
    id: "client-julie-hill",
    name: "Julie Hill",
    dueDateISO: "2025-06-19",
    dueDateLabel: "June 19th, 2025",
    image: "/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png",
    status: "active",
    createdAt: "2025-04-15T00:00:00.000Z",
  },
  {
    id: "client-jasmine-jones",
    name: "Jasmine Jones",
    dueDateISO: "2025-05-15",
    dueDateLabel: "May 15th, 2025",
    image: "/lovable-uploads/edc4d06e-95d5-4730-b269-d713d7bd57f1.png",
    status: "active",
    createdAt: "2025-04-01T00:00:00.000Z",
  },
  {
    id: "client-jane-miller",
    name: "Jane Miller",
    dueDateISO: "2025-03-19",
    dueDateLabel: "March 19th, 2025",
    image: "/lovable-uploads/c2190f40-298f-499c-814b-7d831c4e5fce.png",
    status: "delivered",
    deliveryDate: "2025-03-19T00:00:00.000Z",
    postpartumDate: "2025-05-14T00:00:00.000Z",
    statusDate: "2025-03-19T00:00:00.000Z",
    createdAt: "2025-02-19T00:00:00.000Z",
  },
  {
    id: "client-austin-leybourne",
    name: "Austin Leybourne",
    dueDateISO: "2025-10-24",
    dueDateLabel: "October 24th, 2025",
    image: "/lovable-uploads/eb028e8e-c38f-4206-ac0d-192b345b0b66.png",
    status: "active",
    createdAt: "2025-03-24T00:00:00.000Z",
  },
  {
    id: "client-luna-garcia",
    name: "Luna Garcia",
    dueDateISO: "2025-09-12",
    dueDateLabel: "September 12th, 2025",
    image: "/lovable-uploads/luna.png",
    status: "active",
    createdAt: "2025-04-05T00:00:00.000Z",
  }
];

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
      const firestoreClients = querySnapshot.docs.map(doc => doc.data() as ClientData);
      console.log(`Found ${firestoreClients.length} clients in Firestore`);
      return firestoreClients;
    } else {
      console.log("No clients found in Firestore, creating default clients for new user");
      // First time user - give them default clients with their userId
      const defaultClientsWithUserId = addUserIdToClients(defaultClients, userId);
      await migrateClientsToFirestore(defaultClientsWithUserId);
      return defaultClientsWithUserId;
    }
  } catch (error) {
    console.error(`Failed to load clients from Firestore for user ${userId}:`, error);
    throw error; // Re-throw to let the calling code handle it
  }
};

// Helper function to add userId to client data
function addUserIdToClients(clients: ClientData[], userId: string): ClientData[] {
  return clients.map(client => ({ ...client, userId }));
}

// Helper function to migrate clients to Firestore
async function migrateClientsToFirestore(clients: ClientData[]): Promise<void> {
  try {
    const batch = [];
    for (const client of clients) {
      const clientDocRef = doc(db, 'clients', client.id);
      batch.push(setDoc(clientDocRef, client));
    }
    await Promise.all(batch);
    console.log(`Successfully migrated ${clients.length} clients to Firestore`);
  } catch (error) {
    console.error('Error migrating clients to Firestore:', error);
    throw error;
  }
}

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
  saveClientsToStorage().catch(error => {
    console.error("Error saving clients after change:", error);
  });
  clientsChangeListeners.forEach(listener => listener());
};

let firestoreUnsubscribe: (() => void) | null = null;

export const subscribeToClientChanges = (callback: ClientChangeListener): (() => void) => {
  clientsChangeListeners.push(callback);
  
  // Set up Firestore real-time listener if not already set up
  const userId = getCurrentUserId();
  
  if (userId && !firestoreUnsubscribe) {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('userId', '==', userId));
    
    firestoreUnsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore snapshot received, updating clients");
      
      if (!snapshot.empty) {
        const firestoreClients = snapshot.docs.map(doc => doc.data() as ClientData);
        
        // Update local clients array
        clients.length = 0;
        clients.push(...firestoreClients);
        
        // Notify all listeners except saveClientsToStorage to avoid loops
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
    console.log(`Loaded ${clients.length} clients`);
    
    // Don't call notifyClientsChanged here to avoid triggering save immediately
    clientsChangeListeners.forEach(listener => listener());
  } catch (error) {
    console.error("Error loading clients:", error);
    throw error;
  }
};
