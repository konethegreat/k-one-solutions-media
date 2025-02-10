const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const socketio = require('socket.io');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const notificationsRoutes = require('./routes/notifications');
const messagesRoutes = require('./routes/messages'); // Import the messages route
const searchRoutes = require('./routes/search'); // Import the search route
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow frontend to connect
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes); // Use the messages route at /api/messages
app.use('/api/search', searchRoutes); // Use the search route at /api/search

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for notifications
  socket.on('join', (userId) => {
    socket.join(userId); // Join a room with the user's ID
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export io for use in other files
module.exports = io;