import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
  isOnline: boolean;
}

// Simple network check using fetch
const checkNetworkConnectivity = async (): Promise<NetworkStatus> => {
  try {
    // Try to fetch a small resource to check connectivity
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    
    return {
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      isOnline: true,
    };
  } catch (error) {
    return {
      isConnected: false,
      isInternetReachable: false,
      type: null,
      isOnline: false,
    };
  }
};

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true, // Default to true for better UX
    isInternetReachable: true,
    type: 'wifi',
    isOnline: true,
  });

  useEffect(() => {
    // Check network status immediately
    const checkStatus = async () => {
      const status = await checkNetworkConnectivity();
      setNetworkStatus(status);
    };

    checkStatus();

    // Check periodically
    const interval = setInterval(checkStatus, 10000); // Check every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return networkStatus;
};
