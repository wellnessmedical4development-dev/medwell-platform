import { io } from 'socket.io-client';

const socket = io('/', { autoConnect: false });

export function connectSocket(token) {
  if (socket.connected) return;
  socket.auth = { token };
  socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export function joinAdminRoom() {
  socket.emit('join:admin');
}

export default socket;
