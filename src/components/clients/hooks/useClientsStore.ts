
import { useState, useCallback, useEffect } from 'react';
import { ClientData } from '../types/ClientTypes';
import { clients, subscribeToClientChanges, getCurrentUserId, loadClientsForCurrentUser } from '../store/clientStore';
import { addClient, updateClient, updateClientStatus } from '../store/clientActions';

export const useClientsStore = () => {
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const userId = getCurrentUserId();

  // Load clients for the current user on mount and when userId changes
  useEffect(() => {
    console.log("=== useClientsStore: EFFECT TRIGGERED ===");
    console.log("useClientsStore: Loading clients for current user, userId:", userId);
    
    const loadClients = async () => {
      try {
        setIsLoading(true);
        console.log("useClientsStore: Starting client load...");
        await loadClientsForCurrentUser();
        console.log("✅ useClientsStore: Successfully loaded clients");
        console.log(`Current clients array length: ${clients.length}`);
      } catch (error) {
        console.error("❌ useClientsStore: Error loading clients:", error);
      } finally {
        setIsLoading(false);
        console.log("useClientsStore: Loading finished, isLoading set to false");
      }
    };
    
    if (userId) {
      loadClients();
    } else {
      console.log("useClientsStore: No user ID, skipping client load");
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log("useClientsStore: Setting up subscription");
    const unsubscribe = subscribeToClientChanges(() => {
      console.log("useClientsStore: Detected client change, updating...");
      console.log(`Current clients count after change: ${clients.length}`);
      console.log("Client images in store:", clients.map(c => ({ name: c.name, image: c.image })));
      setForceUpdate(prev => {
        console.log("Force update triggered:", prev + 1);
        return prev + 1;
      });
    }, clients);
    return () => {
      console.log("useClientsStore: Cleaning up subscription");
      unsubscribe();
    };
  }, []);

  // Filter clients for the current user
  const getCurrentUserClients = useCallback(() => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      console.log("getCurrentUserClients: No current user ID");
      return [];
    }
    
    const userClients = clients.filter(client => client.userId === currentUserId);
    console.log(`getCurrentUserClients: Found ${userClients.length} clients for user ${currentUserId}`);
    
    // Debug each client's details INCLUDING IMAGES
    userClients.forEach((client, index) => {
      console.log(`Client ${index + 1}: ${client.name}`);
      console.log(`  - ID: ${client.id}`);
      console.log(`  - Status: ${client.status || 'undefined'}`);
      console.log(`  - Created: ${client.createdAt || 'undefined'}`);
      console.log(`  - User ID: ${client.userId}`);
      console.log(`  - IMAGE URL: "${client.image || 'NO IMAGE SET'}"`);
    });
    
    return userClients;
  }, [forceUpdate]);

  const getActiveClients = useCallback(() => {
    const userClients = getCurrentUserClients();
    console.log(`=== ACTIVE CLIENTS FILTERING ===`);
    console.log(`Input user clients: ${userClients.length}`);
    
    const activeClients = userClients.filter(client => {
      // In our simplified system, any client that is NOT 'past' is considered active
      const isActive = client.status !== 'past';
      
      console.log(`Client ${client.name}:`);
      console.log(`  - Status: "${client.status}"`);
      console.log(`  - Is active: ${isActive}`);
      
      return isActive;
    });
    
    console.log(`Active clients result: ${activeClients.length} clients`);
    activeClients.forEach(client => {
      console.log(`  - Active: ${client.name} (status: ${client.status || 'undefined'})`);
    });
    console.log(`=== END ACTIVE CLIENTS FILTERING ===`);
    
    return activeClients;
  }, [forceUpdate, getCurrentUserClients]);

  return {
    clients: getCurrentUserClients(),
    forceUpdate,
    isLoading,
    addClient,
    updateClient,
    updateClientStatus,
    getActiveClients,
  };
};
