const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

// entity validation
const entitySchema = Joi.object({
    entityName: Joi.string().required(),
    entityDescription: Joi.string().required()
});

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

            // validate request body using Joi schema
            const { error } = entitySchema.validate({ entityName, entityDescription });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const collection = db.collection('entities');
            const result = await collection.insertOne({ name: entityName, description: entityDescription });
            res.status(201).json(result.ops[0]);
        } catch (error) {
            console.error('Error adding entity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
