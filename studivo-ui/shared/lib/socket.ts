import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/shared/store/auth.store';

let socket: Socket | null = null;

// Use window.location.origin or env variable for socket URL
const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

/**
 * Get or create the Socket.IO connection.
 * Always ensures the latest JWT access token is attached for authentication.
 */
export const getSocket = (): Socket => {
  const token = useAuthStore.getState().accessToken;

  if (!socket) {
    socket = io(getSocketUrl(), {
      auth: { token: token ? `Bearer ${token}` : undefined },
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 20,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected cleanly:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });
  } else {
    // Keep auth payload updated with latest token
    socket.auth = { token: token ? `Bearer ${token}` : undefined };
  }

  return socket;
};

/**
 * Connect the socket (ensures auth token is active)
 */
export const connectSocket = (): void => {
  const token = useAuthStore.getState().accessToken;
  if (!token) return;

  const s = getSocket();
  s.auth = { token: `Bearer ${token}` };

  if (!s.connected) {
    s.connect();
  }
};

/**
 * Disconnect and destroy the socket (call on logout)
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

/**
 * Reconnect with a new token
 */
export const reconnectSocket = (): void => {
  disconnectSocket();
  connectSocket();
};

/**
 * Check if socket is currently connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};
