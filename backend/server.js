const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

// connect with mongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // endpoint to add entity
    app.post('/api/entities', async (req, res) => {
        try {
            const { entityName, entityDescription } = req.body;

            // validation
            if (!entityName || typeof entityName !== 'string' || !entityDescription || typeof entityDescription !== 'string') {
                return res.status(400).json({ error: 'Invalid data. Both entityName and entityDescription are required and must be strings.' });
            }

            const collection = db.collection('entities');
            const result = await collection.insertOne({ name: entityName, description: entityDescription });
            res.status(201).json(result.ops[0]);
        } catch (error) {
            console.error('Error adding entity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Start server
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on PORT: ${PORT}`);
    });
});
