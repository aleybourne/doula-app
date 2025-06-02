
import { useClientsStore } from './useClientsStore';

export function useClientStore() {
  const store = useClientsStore();
  
  return {
    ...store,
  };
}
