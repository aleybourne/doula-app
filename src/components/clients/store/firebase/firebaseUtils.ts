
import { db } from '../../../../config/firebase';
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ClientData } from '../../types/ClientTypes';

export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing Firebase connection...");
    const testQuery = query(collection(db, 'clients'));
    await getDocs(testQuery);
    console.log("✅ Firebase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    return false;
  }
};

export const loadClientsFromFirestore = async (userId: string): Promise<ClientData[]> => {
  try {
    console.log(`Loading clients from Firestore for user: ${userId}`);
    console.log(`Using new collection path: clients/${userId}/clients`);
    
    // Use the new nested collection structure: /clients/{userId}/clients
    const clientsRef = collection(db, 'clients', userId, 'clients');
    const querySnapshot = await getDocs(clientsRef);
    
    console.log(`Query snapshot size: ${querySnapshot.size}`);
    
    if (!querySnapshot.empty) {
      const firestoreClients = querySnapshot.docs.map(doc => {
        const data = doc.data() as ClientData;
        console.log(`Loaded client from Firestore: ${data.name}, createdAt: ${data.createdAt}, ID: ${doc.id}`);
        return {
          ...data,
          id: doc.id, // Ensure we use the document ID
          userId: userId // Ensure userId is set
        };
      });
      console.log(`Found ${firestoreClients.length} clients in Firestore for user ${userId}`);
      return firestoreClients;
    } else {
      console.log("No clients found in Firestore for this user");
      return [];
    }
  } catch (error) {
    console.error(`❌ Failed to load clients from Firestore for user ${userId}:`, error);
    throw error;
  }
};

export const saveClientToFirestore = async (client: ClientData): Promise<void> => {
  try {
    if (!client.userId) {
      throw new Error("Cannot save client without userId");
    }
    
    console.log(`Saving client ${client.name} to Firestore with new structure`);
    console.log(`Path: clients/${client.userId}/clients/${client.id}`);
    console.log("Full client object being saved:", JSON.stringify(client, null, 2));
    
    // Use the new nested collection structure: /clients/{userId}/clients/{clientId}
    const clientDocRef = doc(db, 'clients', client.userId, 'clients', client.id);
    await setDoc(clientDocRef, client);
    
    console.log(`✅ Successfully saved client ${client.name} to Firestore at new path`);
  } catch (error) {
    console.error("❌ Error saving client to Firestore:", error);
    throw new Error(`Failed to save client: ${error.message}`);
  }
};

export const getClientFromFirestore = async (clientId: string, userId?: string): Promise<ClientData | null> => {
  try {
    if (!userId) {
      console.error("Cannot get client without userId in new data model");
      return null;
    }
    
    console.log(`Getting client ${clientId} for user ${userId} from new structure`);
    
    // Use the new nested collection structure: /clients/{userId}/clients/{clientId}
    const clientDocRef = doc(db, 'clients', userId, 'clients', clientId);
    const clientDoc = await getDoc(clientDocRef);
    
    if (clientDoc.exists()) {
      const data = clientDoc.data() as ClientData;
      return {
        ...data,
        id: clientDoc.id,
        userId: userId
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to get client with ID ${clientId}:`, error);
    return null;
  }
};

export const deleteClientFromFirestore = async (clientId: string, userId: string): Promise<void> => {
  try {
    console.log(`Deleting client ${clientId} for user ${userId} from new structure`);
    console.log(`Path: clients/${userId}/clients/${clientId}`);
    
    // Use the new nested collection structure: /clients/{userId}/clients/{clientId}
    const clientDocRef = doc(db, 'clients', userId, 'clients', clientId);
    await deleteDoc(clientDocRef);
    
    console.log(`✅ Successfully deleted client ${clientId} from Firestore`);
  } catch (error) {
    console.error(`❌ Error deleting client ${clientId} from Firestore:`, error);
    throw new Error(`Failed to delete client: ${error.message}`);
  }
};
