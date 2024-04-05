const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', routes);

const url = 'mongodb://localhost:27017';
const dbName = 'WebSeries';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  seriesData: { type: Object, required: true },
});

const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT: ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.send(`Database Connection Status: ${mongoose.connection.readyState}`);
});

app.post('/register', (req, res) => {
  const { username, password, seriesData } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = new User({
        username,
        password: bcrypt.hashSync(password, 10),
        seriesData,
      });

      return newUser.save();
    })
    .then(user => {
      res.status(201).json({ message: 'User registered successfully', user });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          username: user.username,
          seriesData: user.seriesData,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      // Setting token in cookie
      res.cookie('token', token, { httpOnly: true });

      res.status(200).json({ message: 'Logged in successfully', token });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    username: req.user.username,
    seriesData: req.user.seriesData,
  });
});
