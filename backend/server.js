const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes');

const app = express(); // Define app before using it
app.use('/', routes);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongoDB();

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Home route
app.get("/", (req, res) => {
  const databaseStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    message: "o_O",
    database: databaseStatus,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 server running on PORT: ${PORT}`);
});

module.exports = server;
