import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useAuth } from '../hooks/remote/useAuth';

export function SocketManager() {
    const { token } = useAuth();
    const {
        connectPrivate,
        disconnectPrivate,
        isPrivateConnected
    } = useSocketContext();

    useEffect(() => {
        if (token && !isPrivateConnected) {
            console.log('🔑 Token found, initializing private connection...');
            connectPrivate(token);
        }

        else if (!token && isPrivateConnected) {
            console.log('👋 No token found, disconnecting private socket...');
            disconnectPrivate();
        }

    }, [token, isPrivateConnected, connectPrivate, disconnectPrivate]);

    return null;
}