const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/WebSeries';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Define entity schema and model
const entitySchema = new mongoose.Schema({
  entityName: { type: String, required: true },
  entityDescription: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Add created_by field
});
const Entity = mongoose.model('Entity', entitySchema);

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
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

// Add entity route
app.post('/api/entities', authenticateToken, async (req, res) => {
  const { entityName, entityDescription } = req.body;

  try {
    const newEntity = new Entity({ entityName, entityDescription, created_by: req.user.id });
    await newEntity.save();

    const entities = await Entity.find();
    res.status(201).json(entities);
  } catch (error) {
    console.error('Error adding entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all entities route
app.get('/api/entities', async (req, res) => {
  const { created_by } = req.query;

  try {
    const entities = created_by ? await Entity.find({ created_by }) : await Entity.find();
    res.status(200).json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single entity route
app.get('/api/entities/:id', async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.status(200).json(entity);
  } catch (error) {
    console.error('Error fetching entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update entity route
app.put('/api/entities/:id', authenticateToken, async (req, res) => {
  const { entityName, entityDescription } = req.body;

  try {
    const entity = await Entity.findByIdAndUpdate(req.params.id, { entityName, entityDescription }, { new: true });
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const entities = await Entity.find();
    res.status(200).json(entities);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete entity route
app.delete('/api/entities/:id', authenticateToken, async (req, res) => {
  try {
    const entity = await Entity.findByIdAndDelete(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const entities = await Entity.find();
    res.status(200).json(entities);
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Fetch users with only the username field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
