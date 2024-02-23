const express = require('express');
const router = express.Router();

router.get('/gather', async (req, res) => {
    res.json({ "msg": "Hi" });
});

router.post('/create', async (req, res) => {
    res.json({ "msg": "Created" });
});

router.put('/update', async (req, res) => {
    res.json({ "msg": "Updated" });
});

router.delete('/remove', async (req, res) => {
    res.json({ "msg": "Deleted" });
});

module.exports = router;
