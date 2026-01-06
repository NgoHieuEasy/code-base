/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useSocketContext } from '../context/SocketContext';
import { socketService } from '../services/socket';

export function useSocketBalanceUpdate() {
    const queryClient = useQueryClient();
    const { isPrivateConnected } = useSocketContext();

    const [balanceUpdate, setBalanceUpdate] = useState<any>(null);


    useEffect(() => {
        if (!isPrivateConnected) {
            console.log('Not connected to private socket, skipping balance update...');
            return;
        };

        const unsubBalanceUpdate = socketService.onBalanceUpdate((data) => {
            setBalanceUpdate(data);
            queryClient.invalidateQueries({
                queryKey: ["portfolio-futures-balance"],
            });
            queryClient.invalidateQueries({
                queryKey: ["portfolio-balances"],
            });
        });

        return () => {
            unsubBalanceUpdate();
        };
    }, [isPrivateConnected]);

    return balanceUpdate;
}

