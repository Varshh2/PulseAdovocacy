const express = require('express');
const router = express.Router();
const SubscribedUser = require('../models/subscribedUser');
const isAuthenticated = require('../middleWare/authentication'); // Import authentication middleware

// Apply authentication middleware to all routes under '/subscribedUsers'
router.use(isAuthenticated);

// GET route for displaying subscribed users
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const subscribedUsers = await SubscribedUser.find().sort({ createdAt: -1 });
        res.render('subscribedUsers', { subscribedUsers });
    } catch (error) {
        res.status(500).send('Error fetching subscribed users');
    }
});

// GET route for rendering the form to create a new subscribed user
router.get('/create', isAuthenticated, (req, res) => {
    res.render('createNewUser'); // Assuming you have a template for creating a new user
});

// POST route for creating a new subscribed user
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        // Check if a user with the same email already exists
        const existingUser = await SubscribedUser.findOne({ email: req.body.email });
        if (existingUser) {
            // If a user with the same email already exists, redirect back to the same page with an error message
            return res.redirect('/subscribedUsers');
        }

        // If no duplicate user found, create and save the new subscribed user
        const subscribedUser = new SubscribedUser(req.body);
        await subscribedUser.save();

        // Redirect back to the subscribed users page after creating the user
        res.redirect('/subscribedUsers');
    } catch (error) {
        res.status(400).send(error.message);
    }
});



// GET route for rendering the editSubscribedUser.ejs file
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const user = await SubscribedUser.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('editSubscribedUser', { user });
    } catch (error) {
        res.status(500).send('Error fetching user details');
    }
});

// Route for soft deleting a subscribed user
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const subscribedUser = await SubscribedUser.findById(req.params.id);

        if (!subscribedUser) {
            return res.status(404).send('User not found');
        }

        subscribedUser.deletedAt = new Date();
        await subscribedUser.save();

        res.redirect('/subscribedUsers');
    } catch (error) {
        res.status(500).send('Error soft deleting subscribed user');
    }
});

module.exports = router;
