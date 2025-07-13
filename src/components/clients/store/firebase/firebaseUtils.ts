
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
    console.log(`🔍 === LOADING CLIENTS FROM FIRESTORE ===`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`📁 Path: clients/${userId}/clients`);
    
    // Test Firebase connection first
    const connectionOk = await testFirebaseConnection();
    if (!connectionOk) {
      console.error("❌ Firebase connection failed - cannot load clients");
      return [];
    }
    
    // Use the new nested collection structure: /clients/{userId}/clients
    const clientsRef = collection(db, 'clients', userId, 'clients');
    const querySnapshot = await getDocs(clientsRef);
    
    console.log(`📊 Query Results:`);
    console.log(`   - Documents found: ${querySnapshot.size}`);
    console.log(`   - Collection empty: ${querySnapshot.empty}`);
    
    if (!querySnapshot.empty) {
      const firestoreClients = querySnapshot.docs.map(doc => {
        const data = doc.data() as ClientData;
        console.log(`✅ Client found: "${data.name}" (ID: ${doc.id})`);
        console.log(`   - Created: ${data.createdAt}`);
        console.log(`   - Birth Stage: ${data.birthStage || 'NOT SET'}`);
        
        return {
          ...data,
          id: doc.id,
          userId: userId,
          // Ensure birthStage field exists with default value
          birthStage: data.birthStage || 'pregnant'
        };
      });
      
      console.log(`🎉 Successfully loaded ${firestoreClients.length} clients`);
      
      // Log specific client we're looking for
      const targetClient = firestoreClients.find(c => c.id === 'client-f33ee714-4e52-4683-a754-34fd1aa3f9de');
      if (targetClient) {
        console.log(`🎯 Found target client: ${targetClient.name}`);
      } else {
        console.log(`⚠️ Target client 'client-f33ee714-4e52-4683-a754-34fd1aa3f9de' NOT FOUND`);
        console.log(`📋 Available client IDs:`, firestoreClients.map(c => c.id));
      }
      
      return firestoreClients;
    } else {
      console.log(`⚠️ === NO CLIENTS FOUND ===`);
      console.log(`🔧 Troubleshooting steps:`);
      console.log(`   1. Check if documents exist at: /clients/${userId}/clients`);
      console.log(`   2. Verify Firestore security rules allow read access`);
      console.log(`   3. Confirm user is authenticated: ${!!userId}`);
      console.log(`   4. Check Firestore console for data structure`);
      
      return [];
    }
  } catch (error) {
    console.error(`❌ CRITICAL ERROR loading clients:`, error);
    console.error(`🔍 Error details:`, {
      code: (error as any)?.code,
      message: (error as any)?.message,
      userId,
      path: `clients/${userId}/clients`
    });
    
    // Re-throw to trigger fallback mechanisms
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
