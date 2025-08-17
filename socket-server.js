// Minimal ScholarConnect socket.io server for real-time messaging (ESM version)
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
  }

  socket.on('join', ({ userId }) => {
    if (userId) socket.join(userId);
  });

  socket.on('send_message', (msg) => {
    // Broadcast to recipient and sender for instant UI update
    if (msg.recipient_id) io.to(msg.recipient_id).emit('new_message', msg);
    if (msg.sender_id) io.to(msg.sender_id).emit('new_message', msg);
  });

  socket.on('disconnect', () => {
    // Optionally handle disconnect logic
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
