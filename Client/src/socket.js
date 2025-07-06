
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  autoConnect: false, // optional: only connect after login if needed
  transports: ['websocket'],
});
