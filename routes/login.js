const express = require('express');
const router = express.Router();
const passport = require('passport');
const scrapeAndSave = require('../webScraping'); // Import your scraping function


router.get('/', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}), async (req, res) => {
    // Call the scrapeAndLog function after successful authentication
    try {
        await scrapeAndSave();
        console.log('Web scraping and logging completed successfully.');
    } catch (error) {
        console.error('Error in web scraping and logging:', error);
    }
});

module.exports = router;
