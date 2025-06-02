
import { useState, useCallback, useEffect } from 'react';
import { ClientData } from '../types/ClientTypes';
import { clients, subscribeToClientChanges, getCurrentUserId, loadClientsForCurrentUser } from '../store/clientStore';
import { addClient, updateClient, updateClientStatus, restoreClient } from '../store/clientActions';

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
      setForceUpdate(prev => prev + 1);
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
    return userClients;
  }, [forceUpdate]);

  const getActiveClients = useCallback(() => {
    const userClients = getCurrentUserClients();
    const activeClients = userClients.filter(client => 
      client.status === 'active' || 
      client.status === 'delivered' || 
      !client.status
    );
    console.log(`useClientsStore: Getting active clients for user (count: ${activeClients.length})`);
    
    return activeClients;
  }, [forceUpdate, getCurrentUserClients]);

  const getArchivedClients = useCallback(() => {
    const userClients = getCurrentUserClients();
    return userClients.filter(client => client.status === 'archived');
  }, [forceUpdate, getCurrentUserClients]);

  return {
    clients: getCurrentUserClients(),
    forceUpdate,
    isLoading,
    addClient,
    updateClient,
    updateClientStatus,
    restoreClient,
    getActiveClients,
    getArchivedClients,
  };
};
