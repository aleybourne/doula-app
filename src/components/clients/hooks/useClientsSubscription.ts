
import { useState, useEffect } from 'react';
import { clientsChangeListeners } from '../store/clientSubscriptions';

export const useClientsSubscription = () => {
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => setForceUpdate(prev => prev + 1);
    clientsChangeListeners.push(listener);
    return () => {
      const index = clientsChangeListeners.indexOf(listener);
      if (index !== -1) {
        clientsChangeListeners.splice(index, 1);
      }
    };
  }, []);
};

