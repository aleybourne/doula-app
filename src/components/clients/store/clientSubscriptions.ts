
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { ClientData, ClientChangeListener } from '../types/ClientTypes';

export const clientsChangeListeners: Array<ClientChangeListener> = [];
let firestoreUnsubscribe: (() => void) | null = null;

export const getCurrentUserId = (): string | null => {
  const userId = auth.currentUser?.uid || null;
  console.log("Current user ID:", userId);
  return userId;
};

export const notifyClientsChanged = () => {
  clientsChangeListeners.forEach(listener => listener());
};

export const subscribeToClientChanges = (
  callback: ClientChangeListener,
  clients: ClientData[]
): (() => void) => {
  clientsChangeListeners.push(callback);
  
  const userId = getCurrentUserId();
  
  if (userId && !firestoreUnsubscribe) {
    console.log("Setting up Firestore real-time listener for user:", userId);
    console.log(`Using new collection path: clients/${userId}/clients`);
    
    // Use the new nested collection structure: /clients/{userId}/clients
    const clientsRef = collection(db, 'clients', userId, 'clients');
    
    firestoreUnsubscribe = onSnapshot(clientsRef, (snapshot) => {
      console.log("Firestore snapshot received from new structure, updating clients");
      
      if (!snapshot.empty) {
        const firestoreClients = snapshot.docs.map(doc => {
          const data = doc.data() as ClientData;
          console.log(`Real-time update - client: ${data.name}, createdAt: ${data.createdAt}`);
          return {
            ...data,
            id: doc.id,
            userId: userId
          };
        });
        
        console.log(`Real-time listener found ${firestoreClients.length} clients from new structure`);
        
        // Update local clients array
        clients.length = 0;
        clients.push(...firestoreClients);
        
        // Notify all listeners
        notifyClientsChanged();
      } else {
        console.log("Real-time listener: No clients found in new structure");
        clients.length = 0;
        notifyClientsChanged();
      }
    }, (error) => {
      console.error("Error in Firestore client subscription with new structure:", error);
    });
  }
  
  return () => {
    const index = clientsChangeListeners.indexOf(callback);
    if (index !== -1) {
      clientsChangeListeners.splice(index, 1);
    }
    
    if (clientsChangeListeners.length === 0 && firestoreUnsubscribe) {
      console.log("Cleaning up Firestore listener");
      firestoreUnsubscribe();
      firestoreUnsubscribe = null;
    }
  };
};
