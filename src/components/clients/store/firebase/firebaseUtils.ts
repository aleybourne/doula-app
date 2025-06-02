
import { db } from '../../../../config/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
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
    
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    console.log(`Query snapshot size: ${querySnapshot.size}`);
    
    if (!querySnapshot.empty) {
      const firestoreClients = querySnapshot.docs.map(doc => {
        const data = doc.data() as ClientData;
        console.log(`Loaded client from Firestore: ${data.name}, createdAt: ${data.createdAt}, ID: ${doc.id}`);
        return data;
      });
      console.log(`Found ${firestoreClients.length} clients in Firestore`);
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
    console.log(`Saving client ${client.name} to Firestore with ID: ${client.id}`);
    console.log("Full client object being saved:", JSON.stringify(client, null, 2));
    
    const clientDocRef = doc(db, 'clients', client.id);
    await setDoc(clientDocRef, client);
    
    console.log(`✅ Successfully saved client ${client.name} to Firestore`);
  } catch (error) {
    console.error("❌ Error saving client to Firestore:", error);
    throw new Error(`Failed to save client: ${error.message}`);
  }
};

export const getClientFromFirestore = async (clientId: string): Promise<ClientData | null> => {
  try {
    const clientDocRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientDocRef);
    
    if (clientDoc.exists()) {
      return clientDoc.data() as ClientData;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to get client with ID ${clientId}:`, error);
    return null;
  }
};

export const deleteClientFromFirestore = async (clientId: string): Promise<void> => {
  try {
    console.log(`Deleting client ${clientId} from Firestore`);
    
    const clientDocRef = doc(db, 'clients', clientId);
    await deleteDoc(clientDocRef);
    
    console.log(`✅ Successfully deleted client ${clientId} from Firestore`);
  } catch (error) {
    console.error(`❌ Error deleting client ${clientId} from Firestore:`, error);
    throw new Error(`Failed to delete client: ${error.message}`);
  }
};
