const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// CORS — allow all localhost origins (dev)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps) or any localhost origin
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); // Handles preflight OPTIONS automatically
app.use(express.json());

// Connect DB
const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.log('No MONGO_URI found, initializing mongodb-memory-server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

// Setup Socket.io
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', ({ senderId, receiverId, content }) => {
    io.to(receiverId).emit('message', { senderId, content });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
