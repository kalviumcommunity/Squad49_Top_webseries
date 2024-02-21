const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema and model if needed
// const Schema = mongoose.Schema;
// const YourModel = mongoose.model('YourModel', new Schema({ /* schema definition */ }));

app.get('/ping', (req, res) => {
    res.send('pong');
});

// Add a route to check database connection status
app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.send(`Database Connection Status: ${dbStatus}`);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
