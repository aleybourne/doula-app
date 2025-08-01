
import { ClientData } from '../../types/ClientTypes';
import { clients } from '../clientStore';
import { getCurrentUserId, notifyClientsChanged } from '../clientSubscriptions';
import { saveClientToFirestore, deleteClientFromFirestore } from '../firebase/firebaseUtils';
import { v4 as uuidv4 } from 'uuid';

export const addClient = async (client: ClientData): Promise<ClientData> => {
  console.log("🔥 === ADD CLIENT FUNCTION CALLED ===");
  
  console.log("🔐 Step 1: Getting current user ID...");
  const userId = getCurrentUserId();
  console.log("👤 Current user ID result:", userId);
  
  if (!userId) {
    console.error("❌ Authentication check failed in addClient - no user ID");
    throw new Error("Cannot add client - user not authenticated");
  }
  console.log("✅ Authentication check passed in addClient");
  
  console.log("=== ADDING CLIENT TO NEW FIRESTORE STRUCTURE ===");
  console.log("User ID:", userId);
  console.log("Client data before processing:", client);
  console.log("Will save to path: clients/{userId}/clients/{clientId}");
  
  // Ensure the client has the current user's ID and a unique ID
  if (!client.status) client.status = "active";
  if (!client.birthStage) client.birthStage = "pregnant";
  
  // Always set createdAt to current timestamp when adding a new client
  client.createdAt = new Date().toISOString();
  console.log(`Setting createdAt for new client ${client.name}: ${client.createdAt}`);
  
  // Generate a unique ID if not provided
  if (!client.id) {
    client.id = `client-${uuidv4()}`;
  }
  
  // CRITICAL: Always ensure userId is set
  client.userId = userId;
  
  console.log("Final client data with userId:", client);
  console.log(`Saving to: clients/${userId}/clients/${client.id}`);
  
  
  try {
    console.log("🔥 === STARTING CLIENT SAVE PROCESS ===");
    console.log("⏰ Timestamp:", new Date().toISOString());
    
    // PRE-SAVE DEBUG STATEMENT
    console.log("🎯 === PRE-SAVE DEBUG: DOULA/USER ID VERIFICATION ===");
    console.log("👤 DOULA/USER ID being used:", userId);
    console.log("👤 Client name being saved:", client.name);
    console.log("📁 Full Firebase path that will be used:", `clients/${userId}/clients/${client.id}`);
    console.log("🔗 Client userId field:", client.userId);
    console.log("🎯 === END PRE-SAVE DEBUG ===");
    
    // Add to Firestore first using new structure
    console.log("📤 Step 1: Saving to Firestore...");
    console.log("📋 About to save client:", JSON.stringify(client, null, 2));
    await saveClientToFirestore(client);
    console.log("✅ Step 1 complete: Client saved to Firestore");
    
    // POST-SAVE DEBUG STATEMENT
    console.log("🎉 === POST-SAVE DEBUG: SAVE CONFIRMATION ===");
    console.log("✅ SAVE COMPLETED SUCCESSFULLY");
    console.log("👤 DOULA/USER ID that was used:", userId);
    console.log("🆔 Client ID that was saved:", client.id);
    console.log("👤 Client name that was saved:", client.name);
    console.log("⏰ Save completion timestamp:", new Date().toISOString());
    console.log("📁 Exact Firebase path used:", `clients/${userId}/clients/${client.id}`);
    console.log("🎉 === END POST-SAVE DEBUG ===");
    
    // Update local array
    console.log("📋 Step 2: Adding to local array...");
    console.log(`Local array before: ${clients.length} clients`);
    clients.unshift(client);
    console.log(`Local array after: ${clients.length} clients`);
    
    // Log the added client details
    console.log("📝 Added client details:");
    console.log(`  - Name: ${client.name}`);
    console.log(`  - ID: ${client.id}`);
    console.log(`  - User ID: ${client.userId}`);
    console.log(`  - Status: ${client.status}`);
    console.log(`  - Birth Stage: ${client.birthStage}`);
    
    // Notify listeners
    console.log("📢 Step 3: Notifying listeners...");
    notifyClientsChanged();
    console.log("✅ Step 3 complete: Listeners notified");
    
    console.log(`🎉 === CLIENT SAVE PROCESS COMPLETE ===`);
    console.log(`Successfully added client ${client.name} to new structure with userId: ${client.userId}`);
    
    return client;
  } catch (error) {
    console.error("❌ === CLIENT SAVE PROCESS FAILED ===");
    console.error("❌ Error adding client to new structure:", error);
    throw error;
  }
};

export const updateClient = async (updatedClient: ClientData) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot update client - user not authenticated");
  }
  
  // Only update if the client belongs to the current user
  const clientIndex = clients.findIndex(client => 
    client.id === updatedClient.id && client.userId === userId
  );
  
  if (clientIndex === -1) {
    throw new Error(`Client ${updatedClient.id} not found or access denied`);
  }
  
  // Ensure we keep the userId in the updated client
  updatedClient.userId = userId;
  
  try {
    console.log(`=== UPDATING CLIENT ${updatedClient.name} ===`);
    console.log(`Image URL being saved: "${updatedClient.image || 'NO IMAGE'}"`);
    console.log(`Path: clients/${userId}/clients/${updatedClient.id}`);
    
    // Update in Firestore first using new structure
    await saveClientToFirestore(updatedClient);
    console.log("✅ Successfully saved to Firestore");
    
    // Update local array with enhanced logging
    clients[clientIndex] = updatedClient;
    console.log("✅ Updated local store");
    console.log(`✅ Local client now has image: "${clients[clientIndex].image || 'NO IMAGE'}"`);
    
    // Force immediate and delayed notifications
    notifyClientsChanged();
    setTimeout(() => {
      console.log("📢 Secondary notification for UI refresh");
      notifyClientsChanged();
    }, 100);
    
    console.log(`=== CLIENT UPDATE COMPLETE ===`);
  } catch (error) {
    console.error("Error updating client in new Firestore structure:", error);
    throw new Error(`Failed to update client: ${error.message}`);
  }
};

export const deleteClient = async (clientId: string, reason: string) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot delete client - user not authenticated");
  }
  
  // Verify the client belongs to the current user before deleting
  const clientToDelete = clients.find(client => client.id === clientId && client.userId === userId);
  if (!clientToDelete) {
    throw new Error(`Client ${clientId} not found or access denied`);
  }
  
  try {
    console.log(`Deleting client ${clientId} from new structure for user ${userId}`);
    console.log(`Path: clients/${userId}/clients/${clientId}`);
    
    // Remove from Firestore first using new structure
    await deleteClientFromFirestore(clientId, userId);
    
    // Remove from local array
    const clientIndex = clients.findIndex(client => client.id === clientId);
    if (clientIndex !== -1) {
      clients.splice(clientIndex, 1);
      notifyClientsChanged();
    }
    
    console.log(`Successfully deleted client ${clientId} for user ${userId} from new structure`);
  } catch (error) {
    console.error(`Error deleting client ${clientId} from new structure:`, error);
    throw error;
  }
};
