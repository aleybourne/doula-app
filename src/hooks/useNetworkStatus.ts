import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine;
      
      // Get connection info if available (modern browsers)
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      setNetworkStatus({
        isOnline,
        connection: connection ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        } : undefined,
      });
    };

    // Update on mount
    updateNetworkStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Listen for connection changes if supported
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}