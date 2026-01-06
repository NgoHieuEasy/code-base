/* eslint-disable react-refresh/only-export-components */
import { socketService } from '@/services/socket';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface SocketContextValue {
  isPublicConnected: boolean;
  isPrivateConnected: boolean;
  connectPrivate: (token: string) => void;
  disconnectPrivate: () => void;
}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within SocketProvider');
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  publicUrl?: string;
  privateUrl?: string;
}

export function SocketProvider({ children, publicUrl, privateUrl }: SocketProviderProps) {
  const [isPublicConnected, setIsPublicConnected] = useState(false);
  const [isPrivateConnected, setIsPrivateConnected] = useState(false);

  useEffect(() => {
    console.log('🔌 Initializing public socket connection...');
    socketService.connectPublic(publicUrl);
    const cleanupListener = socketService.onConnectionChange('public', (status: boolean) => {
      setIsPublicConnected(status);
      console.log('🔌 Public socket connection status:', status);
    });

    return () => {
      console.log('🔌 Cleaning up public socket...');
      cleanupListener(); 
      socketService.disconnectPublic(); 
    };
  }, [publicUrl]);

  const connectPrivate = useCallback((token: string) => {
    console.log('🔐 Connecting private socket...');
    socketService.connectPrivate(privateUrl, token);
  }, [privateUrl]);

  const disconnectPrivate = useCallback(() => {
    console.log('🔐 Disconnecting private socket...');
    socketService.disconnectPrivate();
    setIsPrivateConnected(false); 
  }, []);
  useEffect(() => {
    const cleanupListener = socketService.onConnectionChange('private', (status) => {
      setIsPrivateConnected(status);
    });

    return () => {
      cleanupListener();
    };
  }, []);

  return (
    <SocketContext.Provider 
      value={{ 
        isPublicConnected, 
        isPrivateConnected, 
        connectPrivate, 
        disconnectPrivate ,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}