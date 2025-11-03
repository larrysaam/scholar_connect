import 'dotenv/config';
// Minimal ResearchWhoa socket.io server for real-time messaging (ESM version)
import { Server } from 'socket.io';
import http from 'http';
import { createClient } from '@supabase/supabase-js';

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: '*' }
});

// --- Supabase client setup ---
const SUPABASE_URL = process.env.SUPABASE_URL || '<YOUR_SUPABASE_URL>';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// --- end supabase setup ---

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

  // --- WhatsApp-style markAsRead handler ---
  socket.on('markAsRead', async ({ bookingId, userId, messageIds }) => {
    if (!Array.isArray(messageIds) || messageIds.length === 0) return;
    // Update DB: set status='read' for all messageIds
    await supabase
      .from('messages')
      .update({ status: 'read' })
      .in('id', messageIds);
    // Fetch updated messages to broadcast
    const { data: updatedMessages } = await supabase
      .from('messages')
      .select('*')
      .in('id', messageIds);
    // Broadcast to sender(s) for real-time double tick
    if (updatedMessages && updatedMessages.length > 0) {
      updatedMessages.forEach((msg) => {
        if (msg.sender_id) io.to(msg.sender_id).emit('message_read', msg);
        if (msg.recipient_id) io.to(msg.recipient_id).emit('message_read', msg);
      });
    }
  });

  socket.on('disconnect', () => {
    // Optionally handle disconnect logic
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
