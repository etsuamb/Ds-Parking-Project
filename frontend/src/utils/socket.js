import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initSocket = () => {
  if (!socket) {
    // Socket.io-client expects http:// or https://, it will upgrade to WebSocket automatically
    socket = io('http://localhost:4000', {
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      timeout: 10000,
      forceNew: false,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to notification service');
      reconnectAttempts = 0;
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from notification service:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, need to manually reconnect
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      reconnectAttempts++;
      console.warn(`⚠️ Socket connection error (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`, error.message);
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('❌ Max reconnection attempts reached. Notification service unavailable.');
        // Don't show toast on every attempt, only on final failure
        if (reconnectAttempts === MAX_RECONNECT_ATTEMPTS) {
          toast.error('Notification service unavailable. Real-time updates disabled.', {
            duration: 5000,
          });
        }
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected to notification service after ${attemptNumber} attempts`);
      reconnectAttempts = 0;
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Attempting to reconnect (${attemptNumber}/${MAX_RECONNECT_ATTEMPTS})...`);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect to notification service');
      toast.error('Unable to connect to notification service. Real-time updates disabled.', {
        duration: 5000,
      });
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
};

export const getSocket = () => socket;

export const isSocketConnected = () => {
  return socket && socket.connected;
};

