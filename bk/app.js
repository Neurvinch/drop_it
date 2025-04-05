const express = require("express");
const mongoose = require("mongoose");
const Auth = require("./Controllers/Auth")
const http = require('http');
const { Server } = require('socket.io');
const Auction = require("./Controllers/auction");
const bid = require("./Controllers/bid");
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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.set('io', io);

app.use("/api", Auth , wishlist, product, profile);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
