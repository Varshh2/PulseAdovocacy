const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/users');

// Configure session middleware
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Configure flash middleware
router.use(flash());

// Your existing route for rendering the forgotPassword page
router.get('/', (req, res) => {
    res.render('forgotPassword');
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'majrpulseadv@gmail.com',
        pass: 'hokmjrkdemiwyhxy'
    }
});

// Route for handling the form submission for password reset
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        const mailOptions = {
            from: 'majrpulseadv@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `http://localHost:3000/resetPassword/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        // Redirect to the login page after sending the email
        res.render('login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});


module.exports = router;
