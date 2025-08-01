
import { db } from '../../../../config/firebase';
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ClientData } from '../../types/ClientTypes';
import { verifyAuthenticationState, waitForAuthentication } from './authUtils';

// Utility function to remove undefined values from objects (Firestore doesn't accept undefined)
const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        sanitized[key] = sanitizeForFirestore(value);
      }
    }
    return sanitized;
  }
  
  return obj;
};

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
    
    // Verify authentication is ready before loading clients
    console.log("🔐 Verifying authentication before loading clients...");
    const authResult = await waitForAuthentication();
    
    if (!authResult.isAuthenticated) {
      console.error("❌ Authentication not ready for loading clients");
      throw new Error(`Authentication failed: ${authResult.error}`);
    }
    
    console.log("✅ Authentication verified - proceeding with client load");
    
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
        console.log(`   - IMAGE URL: "${data.image || 'NO IMAGE'}"`);
        
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
    
    // Check if it's a permissions error
    if ((error as any)?.code === 'permission-denied') {
      console.error("❌ Permission denied - user may not be authenticated properly");
      console.error("❌ Check Firestore security rules and authentication state");
    }
    
    // Re-throw to trigger fallback mechanisms
    throw error;
  }
};

export const saveClientToFirestore = async (client: ClientData): Promise<void> => {
  console.log("🚀 === FIRESTORE SAVE FUNCTION CALLED ===");
  console.log("⏰ Timestamp:", new Date().toISOString());
  
  try {
    console.log("🔍 Step 1: Validating client data...");
    console.log("📋 Client object received:", JSON.stringify(client, null, 2));
    
    if (!client.userId) {
      console.error("❌ CRITICAL: Cannot save client without userId");
      throw new Error("Cannot save client without userId");
    }
    console.log("✅ Client has valid userId:", client.userId);
    
    console.log("🚀 === STARTING FIRESTORE SAVE PROCESS ===");
    
    // First, verify authentication is ready
    console.log("🔐 Step 2: Verifying authentication before save...");
    const authResult = await waitForAuthentication();
    console.log("🔐 Authentication result:", authResult);
    
    if (!authResult.isAuthenticated) {
      console.error("❌ CRITICAL: Authentication not ready for Firestore operation");
      console.error("❌ Auth error:", authResult.error);
      throw new Error(`Authentication failed: ${authResult.error}`);
    }
    
    console.log("✅ Authentication verified - proceeding with save");
    console.log(`👤 User ID: ${client.userId}`);
    console.log(`📝 Client Name: ${client.name}`);
    console.log(`🆔 Client ID: ${client.id}`);
    console.log(`📁 Path: clients/${client.userId}/clients/${client.id}`);
    console.log("📋 Full client object being saved:", JSON.stringify(client, null, 2));
    
    // Sanitize the client data to remove undefined values (Firestore doesn't accept them)
    console.log("🧹 Step 2.5: Sanitizing client data for Firestore...");
    const sanitizedClient = sanitizeForFirestore(client);
    console.log("✅ Client data sanitized, undefined values removed");
    
    // Use the new nested collection structure: /clients/{userId}/clients/{clientId}
    const clientDocRef = doc(db, 'clients', client.userId, 'clients', client.id);
    
    console.log("💾 Step 3: Attempting to save to Firestore...");
    console.log("📍 Document reference path:", `clients/${client.userId}/clients/${client.id}`);
    await setDoc(clientDocRef, sanitizedClient);
    
    console.log(`✅ SUCCESSFULLY SAVED CLIENT TO FIRESTORE`);
    console.log(`✅ Client ${client.name} saved at: clients/${client.userId}/clients/${client.id}`);
    console.log("⏰ Save completed at:", new Date().toISOString());
    
    // Verify the save by reading it back
    console.log("🔍 Step 4: Verifying save by reading back...");
    const savedDoc = await getDoc(clientDocRef);
    if (savedDoc.exists()) {
      console.log("✅ VERIFICATION SUCCESSFUL - document exists in Firestore");
      console.log("📋 Saved data preview:", {
        id: savedDoc.data().id,
        name: savedDoc.data().name,
        userId: savedDoc.data().userId
      });
      console.log("🎉 === FIRESTORE SAVE COMPLETELY SUCCESSFUL ===");
    } else {
      console.error("❌ CRITICAL: VERIFICATION FAILED - document does not exist after save!");
      throw new Error("Save verification failed - document not found after save");
    }
    
  } catch (error) {
    console.error("❌ === FIRESTORE SAVE FAILED ===");
    console.error("❌ ERROR SAVING CLIENT TO FIRESTORE:", error);
    console.error("🔍 Detailed error information:", {
      code: (error as any)?.code,
      message: (error as any)?.message,
      stack: (error as any)?.stack,
      userId: client.userId,
      clientId: client.id,
      clientName: client.name,
      path: `clients/${client.userId}/clients/${client.id}`,
      timestamp: new Date().toISOString()
    });
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
