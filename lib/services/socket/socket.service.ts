import { io, Socket } from 'socket.io-client';
import { getApiBaseUrl } from '@/lib/config/api';
let socket: Socket | null = null;
export function connectSocket(): Socket {
    if (socket?.connected) return socket;
    const url = getApiBaseUrl();
    socket = io(url, { path: '/socket.io', transports: ['websocket', 'polling'] });
    return socket;
}
export function getSocket(): Socket | null {
    return socket ?? null;
}
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
