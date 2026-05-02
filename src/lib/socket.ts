import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initializeSocket first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};