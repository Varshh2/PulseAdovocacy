const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');



// GET route to render the campaign list
router.get('/', async (req, res) => {
    try {
        // Fetch campaigns from the database
        const campaigns = await Campaign.find().exec();
        
        // Log the fetched campaigns to verify
        console.log(campaigns);
        
        // Render the campaign list EJS template and pass the campaigns data
        res.render('campaignList', { campaigns: campaigns });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
