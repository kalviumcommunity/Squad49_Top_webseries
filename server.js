const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
  });

// Home route
app.get("/status", (req, res) => {
    const databaseStatus = db.readyState === 1 ? "connected" : "disconnected";
    res.json({
      message: "o_O",
      database: databaseStatus,
    });
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 server running on PORT: ${PORT}`);
});
