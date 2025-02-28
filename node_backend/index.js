const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

const app = express();

// More permissive CORS configuration for development
const corsOptions = {
  origin: true, // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Origin']
};

app.use(cors(corsOptions));
app.use(express.json());

// HTTP endpoints
app.post('/login', (req, res) => {
  const id = uuidv4();
  res.json({ success: true, id });
});

// Add endpoint for getting user ID
app.get('/api/id', (req, res) => {
  // For now, return a mock user since we don't have authentication yet
  res.json({ 
    name: "Guest User",
    id: uuidv4()
  });
});

const server = app.listen(8087, () => {
  console.log('HTTP server running on port 8087');
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins during development
    credentials: true,
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  const id = uuidv4();
  socket.emit("id", id);
  
  socket.on("update", (data) => {
    console.log(data);
    io.emit("stateUpdate", data);
  });

  socket.on("disconnect", () => {
    io.emit("disconnection", id);
  });
});