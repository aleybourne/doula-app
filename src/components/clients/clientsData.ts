
// Export the hooks and utility functions
export { useClientStore } from './hooks/useClientStore';
export { calculateGestationAndTrimester } from './utils/gestationUtils';

// Re-export the necessary functions and variables from the client store
export { 
  clients,
  subscribeToClientChanges,
  notifyClientsChanged,
  saveClientsToStorage
} from './store/clientStore';

// Export client management functions from clientActions
export { 
  addClient,
  updateClient,
  updateClientStatus,
  archiveClient,
  deleteClient,
  restoreClient,
  markClientDelivered
} from './store/clientActions';

