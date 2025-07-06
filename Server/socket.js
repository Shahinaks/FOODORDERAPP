// backend/socket.js
import { Server } from 'socket.io';

let ioInstance;

export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // update if your frontend is hosted elsewhere
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id);

    // Register user to their Firebase UID room
    socket.on('register', (uid) => {
      socket.join(uid);
      console.log(`📥 User with UID ${uid} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });

  return ioInstance;
};

// Export getIO as `io` to make usage easy in controllers
export const getIO = () => {
  if (!ioInstance) {
    throw new Error('❌ Socket.io not initialized. Call initSocket(server) first.');
  }
  return ioInstance;
};

export { getIO as io };
