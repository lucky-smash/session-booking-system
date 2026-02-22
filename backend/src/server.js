const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');

const http = require('http');
const { Server } = require("socket.io");

const expertRoutes = require('./routes/expertRoute.js');
const Booking = require('./models/Booking.js');


const app = express();

// Create HTTP server and Socket.IO server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected:", socket.id);
  });
});

// make io accessible in controllers via req.app.get("io")
app.set("io", io);



const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', require('./routes/bookingRoute.js'));
console.log("✅ booking routes mounted at /api/bookings");

// Connect to MongoDB

connectDB();
Booking.syncIndexes()


// Start server

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
