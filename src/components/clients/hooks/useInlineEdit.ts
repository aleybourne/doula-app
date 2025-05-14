
import { useState, useEffect } from 'react';
import { useClientStore } from './useClientStore';
import { ClientData } from '../types/ClientTypes';

export const useInlineEdit = (initialClient: ClientData) => {
  // Store the initial client data and any updates
  const [editingClient, setEditingClient] = useState(() => ({
    ...initialClient,
  }));
  const { updateClient } = useClientStore();
  
  // Update local state if initialClient changes (like on refresh)
  useEffect(() => {
    if (initialClient && Object.keys(initialClient).length > 0) {
      setEditingClient(prev => ({
        ...prev,
        ...initialClient
      }));
    }
  }, [initialClient]);

  const handleChange = (field: keyof ClientData, value: any) => {
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
