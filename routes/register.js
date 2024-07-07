const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;
        const user = new User({ firstName, lastName, email, username, password });
        await user.save();
        res.send('Registration successful');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

module.exports = router;
