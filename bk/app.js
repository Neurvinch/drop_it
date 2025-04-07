const express = require("express");
const mongoose = require("mongoose");
const Auth = require("./Controllers/Auth")
const http = require('http');
const { Server } = require('socket.io');
const Auction = require("./Routes/auction");
const scrap = require("./Routes/Scrap")
const cart = require("./Controllers/cart");
const order = require("./Controllers/order");
const product = require("./Routes/product");
const profile = require("./Routes/profile");
const notification = require('./Controllers/notify');
const transaction = require("./Controllers/transaction");
const wishlist = require("./Routes/wishlist")
const identifier = require("./Middleware/identifier");

const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cookieParser());

// Set CORS options to allow requests from your frontend and include credentials
app.use(
  cors({
    origin:
    // "http://localhost:5173" 
   " https://drop-it-beta.vercel.app/"     ,
    credentials: true,
  })
);

app.set('io', io);

app.use("/api", Auth ,  product, profile, scrap ,Auction );

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error);
  });

  // io.on('connection', (socket) => {
  //   console.log('User connected');
  //   socket.on('join', (userId) => socket.join(userId)); // Join user-specific room
  //   socket.on('disconnect', () => console.log('User disconnected'));
  // });

  // io.on('connection', (socket) => {
  //   console.log('User connected');
  //   socket.on('join', (room) => socket.join(room)); // Join auction or user room
  //   socket.on('disconnect', () => console.log('User disconnected'));
  // });

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);
  
    // Send initial messages
    try {
      console.log('Fetching initial messages...');
      const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
      socket.emit('initMessages', messages.reverse());
    } catch (err) {
      console.error('Failed to load initial messages:', err);
    }
  
  
    socket.on('sendMessage', async (msg) => {
      try {
        const message = new Message(msg);
        await message.save();
        io.emit('message', message);
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    });
  
  
   
  
    
  
    socket.on('clearCanvas', () => {
      io.emit('clearCanvas');
    });
  
   
   
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
