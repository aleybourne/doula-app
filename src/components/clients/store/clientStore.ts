import { ClientData, ClientChangeListener } from '../types/ClientTypes';
import { cleanupClientImageData } from '../utils/storageUtils';
import { db } from '../../../config/firebase';
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

// Get the current user ID from localStorage
export const getCurrentUserId = (): string | null => {
  try {
    const userDataStr = localStorage.getItem('push_user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      return userData.id || null;
    }
  } catch (error) {
    console.error("Failed to get current user ID:", error);
  }
  return null;
};

// Initialize clients for a specific user
export const initializeClients = async (): Promise<ClientData[]> => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    console.warn("No user ID found, returning empty client list");
    return [];
  }

  try {
    // Try to get clients from Firestore
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const firestoreClients = querySnapshot.docs.map(doc => doc.data() as ClientData);
      return firestoreClients;
    } else {
      // If no clients found in Firestore for this user, check localStorage as fallback
      const storageKey = `clients_${userId}`;
      const savedClients = localStorage.getItem(storageKey);
      
      if (savedClients) {
        const parsedClients = JSON.parse(savedClients);
        if (parsedClients.length > 0) {
          // Ensure all clients have IDs
          const clientsWithIds = ensureClientsHaveIds(parsedClients);
          // Migrate localStorage clients to Firestore
          const clientsWithUserId = addUserIdToClients(clientsWithIds, userId);
          await migrateClientsToFirestore(clientsWithUserId);
          return clientsWithUserId;
        }
      }
      
      // First time user - give them default clients with their userId
      const defaultClientsWithUserId = addUserIdToClients(defaultClients, userId);
      await migrateClientsToFirestore(defaultClientsWithUserId);
      return defaultClientsWithUserId;
    }
  } catch (error) {
    console.error(`Failed to load clients from Firestore for user ${userId}:`, error);
    
    // Fallback to localStorage if Firestore fails
    try {
      const storageKey = `clients_${userId}`;
      const savedClients = localStorage.getItem(storageKey);
      if (savedClients) {
        return JSON.parse(savedClients);
      }
    } catch (localError) {
      console.error(`Failed to load clients from localStorage for user ${userId}:`, localError);
    }
  }
  
  return [];
};

// Helper function to add userId to client data
function addUserIdToClients(clients: ClientData[], userId: string): ClientData[] {
  return clients.map(client => ({ ...client, userId }));
}

// Helper function to ensure all clients have unique IDs
function ensureClientsHaveIds(clients: ClientData[]): ClientData[] {
  return clients.map(client => {
    if (!client.id) {
      // Generate a unique ID based on name and timestamp as a fallback
      const id = `client-${client.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      return { ...client, id };
    }
    return client;
  });
}

// Helper function to migrate clients from localStorage to Firestore
async function migrateClientsToFirestore(clients: ClientData[]): Promise<void> {
  try {
    for (const client of clients) {
      // Use client id for document ID instead of userId_name
      const clientDocRef = doc(db, 'clients', client.id);
      await setDoc(clientDocRef, client);
    }
    console.log(`Successfully migrated ${clients.length} clients to Firestore`);
  } catch (error) {
    console.error('Error migrating clients to Firestore:', error);
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

// Save clients to Firestore
export const saveClientsToStorage = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Cannot save clients - no user ID found");
    return;
  }
  
  try {
    // Save to Firestore
    for (const client of clients) {
      if (!client.userId) {
        client.userId = userId;
      }
      
      // Ensure client has an ID
      if (!client.id) {
        client.id = `client-${client.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      }
      
      // Use client id for document ID
      const clientDocRef = doc(db, 'clients', client.id);
      await setDoc(clientDocRef, client);
    }
    
    // Also save to localStorage as backup
    const storageKey = `clients_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(clients));
  } catch (error) {
    console.error(`Failed to save clients to Firestore for user ${userId}:`, error);
    
    // Fallback to localStorage if Firestore fails
    try {
      const storageKey = `clients_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(clients));
    } catch (localError) {
      console.error(`Failed to save clients to localStorage for user ${userId}:`, localError);
    }
  }
};

export const clientsChangeListeners: Array<ClientChangeListener> = [];

export const notifyClientsChanged = () => {
  saveClientsToStorage();
  clientsChangeListeners.forEach(listener => listener());
};

export const subscribeToClientChanges = (callback: ClientChangeListener): (() => void) => {
  clientsChangeListeners.push(callback);
  
  // Set up Firestore real-time listener
  const userId = getCurrentUserId();
  let unsubscribeFirestore: (() => void) | null = null;
  
  if (userId) {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('userId', '==', userId));
    
    unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreClients = snapshot.docs.map(doc => doc.data() as ClientData);
        
        // Update local clients array without triggering listeners (to avoid loops)
        const oldLength = clients.length;
        clients.length = 0;
        clients.push(...firestoreClients);
        
        // Only call the callback if this wasn't triggered by our own local update
        if (oldLength !== firestoreClients.length || JSON.stringify(clients) !== JSON.stringify(firestoreClients)) {
          callback();
        }
      }
    }, (error) => {
      console.error("Error in Firestore client subscription:", error);
    });
  }
  
  // Return function to unsubscribe from both local and Firestore listeners
  return () => {
    const index = clientsChangeListeners.indexOf(callback);
    if (index !== -1) {
      clientsChangeListeners.splice(index, 1);
    }
    
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
};

// Load clients when user changes
export const loadClientsForCurrentUser = async () => {
  try {
    const loadedClients = await initializeClients();
    clients.length = 0; // Clear the array
    clients.push(...loadedClients); // Add the loaded clients
    notifyClientsChanged();
  } catch (error) {
    console.error("Error loading clients:", error);
  }
};
