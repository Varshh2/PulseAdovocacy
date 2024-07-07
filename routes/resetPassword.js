const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/users');

router.get('/:token', (req, res) => {
    const token = req.params.token;
    res.render('resetpassword', { token: token });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'majrpulseadv@gmail.com',
        pass: 'hokmjrkdemiwyhxy'
    }
});

router.post('/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const { password, confirmPassword } = req.body;

        // Find user with the given token and valid expiration
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Invalid or expired reset token');
        }

        // Ensure password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        // Update user's password and reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Notify user of successful password reset
        const mailOptions = {
            from: 'majrpulseadv@gmail.com',
            to: user.email,
            subject: 'Password Reset Successful',
            text: `Dear User,\n\nYour password has been successfully reset.\n\nIf you initiated this password reset, you can safely disregard this email. Your password has been updated, and you can now use your new password to sign in to your account.\n\nHowever, if you did not request this password reset, it's possible that someone else may have attempted to access your account. In such cases, we recommend taking the following actions to secure your account:\n\n1. Ensure that your new password is strong and unique.\n2. Check for any unauthorized activity on your account.\n3. Enable additional security measures such as two-factor authentication, if available.\n4. If you notice any suspicious activity or have concerns about the security of your account, please contact our support team immediately.\n\nThank you for your attention to this matter.\n\nBest regards,\nPulse Advocacy Team`
        };

        await transporter.sendMail(mailOptions);

        // Redirect the user to the login page after resetting the password
        res.render('login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error resetting password');
    }
});

module.exports = router;
