import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../utils/config';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [socketSessionID, setSocketSessionID] = useState(null);

    useEffect(() => {
        const newSocket = io(API_BASE_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        newSocket.on('connect', () => {
        });

        newSocket.on('sessionID', (sessionID) => {
            setSocketSessionID(sessionID);
        });

        newSocket.on('disconnect', () => {
        });

        newSocket.on('reconnect', (attemptNumber) => {
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, socketSessionID }}>
            {children}
        </SocketContext.Provider>
    );
};
