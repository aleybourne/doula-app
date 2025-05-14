
import { useClientsStore } from './useClientsStore';
import { archiveClient, deleteClient, restoreClient } from '../store/clientActions';

export function useClientStore() {
  const store = useClientsStore();
  
  return {
    ...store,
    archiveClient,
    deleteClient,
    restoreClient,
  };
}
