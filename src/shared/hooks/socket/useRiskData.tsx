/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { socketService } from '../services/socket';
import { useSocketContext } from '../context/SocketContext';


export function useRiskData() {
    const { isPrivateConnected } = useSocketContext();

    const [riskData, setRiskData] = useState<Record<string, any>>({});

    const [accountRisk, setAccountRisk] = useState<any>(null);

    useEffect(() => {
        if (!isPrivateConnected) {
            console.log('Not connected to private socket, skipping risk data...');
            return;
        };

        const unsubPos = socketService.onPositionRisk((data) => {
            //   console.log('📊 Received position risk data:', data);
            setRiskData((prev) => ({
                ...prev,
                [data.p]: data
            }));
        });

        const unsubAcc = socketService.onAccountRisk((data) => {
            setAccountRisk(data);
        });

        return () => {
            unsubPos();
            unsubAcc();
        };
    }, [isPrivateConnected]);

    return { positionsRisk: riskData, accountRisk };
}

