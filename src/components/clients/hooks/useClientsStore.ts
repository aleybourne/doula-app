
import { useState, useCallback, useEffect } from 'react';
import { ClientData } from '../types/ClientTypes';
import { clients, subscribeToClientChanges } from '../store/clientStore';
import { addClient, updateClient, updateClientStatus, restoreClient } from '../store/clientActions';

export const useClientsStore = () => {
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    console.log("useClientsStore: Setting up subscription");
    const unsubscribe = subscribeToClientChanges(() => {
      console.log("useClientsStore: Detected client change, updating...");
      setForceUpdate(prev => prev + 1);
    });
    return () => {
      console.log("useClientsStore: Cleaning up subscription");
      unsubscribe();
    };
  }, []);

  const getActiveClients = useCallback(() => {
    console.log(`useClientsStore: Getting active clients (count: ${clients.filter(client => 
      client.status === 'active' || 
      client.status === 'delivered' || 
      !client.status
    ).length})`);
    return clients.filter(client => 
      client.status === 'active' || 
      client.status === 'delivered' || 
      !client.status
    );
  }, [forceUpdate]); // Add forceUpdate dependency so it re-calculates when clients change

  const getArchivedClients = useCallback(() => {
    return clients.filter(client => client.status === 'archived');
  }, [forceUpdate]); // Add forceUpdate dependency

  return {
    clients,
    forceUpdate, // Expose forceUpdate so components can use it for re-rendering
    addClient,
    updateClient,
    updateClientStatus,
    restoreClient, // Add this line to expose the restoreClient function
    getActiveClients,
    getArchivedClients,
  };
};
