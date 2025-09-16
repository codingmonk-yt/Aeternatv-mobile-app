import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
  isOnline: boolean;
}

// Simple network status hook that doesn't require external dependencies
export const useNetworkStatusSimple = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true, // Default to true for better UX
    isInternetReachable: true,
    type: 'wifi',
    isOnline: true,
  });

  useEffect(() => {
    // Simple network check using fetch
    const checkNetworkStatus = async () => {
      try {
        // Try to fetch a small resource to check connectivity
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        
        setNetworkStatus({
          isConnected: true,
          isInternetReachable: true,
          type: 'wifi',
          isOnline: true,
        });
      } catch (error) {
        setNetworkStatus({
          isConnected: false,
          isInternetReachable: false,
          type: null,
          isOnline: false,
        });
      }
    };

    // Check immediately
    checkNetworkStatus();

    // Check periodically
    const interval = setInterval(checkNetworkStatus, 10000); // Check every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return networkStatus;
};


