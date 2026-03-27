import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // في بيئة الإنتاج يفضل وضع رابط الواجهة الأمامية فقط
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // الانضمام للغرفة
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // الخروج من الغرفة
  socket.on('leave_room', (data) => {
    socket.leave(data);
    console.log(`User with ID: ${socket.id} left room: ${data}`);
  });

  // استقبال وإعادة إرسال الرسالة المشفرة
  socket.on('send_message', (data) => {
    // الخادم لا يفهم محتوى الرسالة، هو فقط يمرر البيانات المشفرة
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Security Server is running on port ${PORT}`);
});