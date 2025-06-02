
import { useState, useEffect, useRef } from 'react';
import { useClientStore } from './useClientStore';
import { ClientData } from '../types/ClientTypes';

export const useInlineEdit = (initialClient: ClientData) => {
  // Store the initial client data and any updates
  const [editingClient, setEditingClient] = useState(() => ({
    ...initialClient,
  }));
  const { updateClient } = useClientStore();
  const hasInitialized = useRef(false);
  
  // Update local state if initialClient changes (like on refresh)
  useEffect(() => {
    console.log("useInlineEdit: initialClient changed", initialClient);
    
    if (initialClient && Object.keys(initialClient).length > 0 && !hasInitialized.current) {
      console.log("useInlineEdit: Initializing with client data");
      setEditingClient(prev => ({
        ...prev,
        ...initialClient
      }));
      hasInitialized.current = true;
    }
  }, [initialClient.id]); // Only depend on ID to prevent infinite loops

  const handleChange = (field: keyof ClientData, value: any) => {
    console.log("useInlineEdit: handleChange", field, value);
    const updatedClient = {
      ...editingClient,
      [field]: value,
    };
    setEditingClient(updatedClient);
    updateClient(updatedClient);
  };

  return {
    editingClient,
    handleChange,
  };
};
