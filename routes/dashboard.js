const express = require('express');
const router = express.Router();
const MyMGA = require('../models/MyMGA'); // Import the MyMGA model
const isAuthenticated = require('../middleWare/authentication'); // Import the isAuthenticated middleware
const Campaign = require('../models/campaign');


router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Fetch total number of legislative bills
        const totalBills = await MyMGA.countDocuments();
        const totalCampaigns = await Campaign.countDocuments();
        const totalEmailSent = await Campaign.aggregate([
            // Unwind the 'to' array field to deconstruct it into separate documents
            { $unwind: "$to" },
            // Group by null to calculate the total count of email IDs
            { $group: { _id: null, total: { $sum: 1 } } }
        ]);
        // Extract the total count from the result
        const totalEmailCount = totalEmailSent.length > 0 ? totalEmailSent[0].total : 0;
        console.log("Total email IDs sent:", totalEmailCount);

        if (req.user && req.user.username) {
            res.render('dashboard', { username: req.user.username, totalBills, totalCampaigns, totalEmailCount }); // Pass totalBills to the view
        } else {
            res.redirect('/login'); // Redirect to login if user is not authenticated or username is missing
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
