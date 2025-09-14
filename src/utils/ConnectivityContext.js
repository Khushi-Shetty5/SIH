import React, { createContext, useState, useEffect } from 'react';
import * as Network from 'expo-network';

export const ConnectivityContext = createContext();

const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState(null);

  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected);
      setConnectionType(networkState.type);
    };
    checkNetwork();
    // Note: expo-network doesn't provide real-time updates
    // Use a custom dev client with react-native-netinfo for real-time monitoring
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOnline, connectionType }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export default ConnectivityProvider;