// Import required modules
const mailchimp = require('@mailchimp/mailchimp_marketing');
const Campaign = require('../models/campaign'); // Assuming this is the Campaign model

// Configure Mailchimp with your API key
mailchimp.setConfig({
    apiKey: '8b4d64cb3afe75d90c4a183b2ba08de9-us18',
    server: 'us18', // e.g., us1
});

// Function to send campaign
async function sendCampaign(to, subject, emailBody, billId, billTitle, hearingDate) {
    try {
        // Create the campaign in Mailchimp
        const response = await mailchimp.campaigns.create({
            type: 'regular',
            recipients: {
                list_id: [], // empty list to disable using a list
                segment_opts: {
                    saved_segment_id: 0,
                    match: 'any',
                    conditions: []
                }
            },
            settings: {
                subject_line: subject, // Use the subject variable
                from_name: 'Varshita',
                reply_to: 'varshitha909.vr@gmail.com'
            },
            content: {
                html: emailBody // Use the emailBody variable
            }
        });

        // Extract the Mailchimp campaign ID
        const campaignId = response.id;

        // // Create an entry in your MongoDB database for the campaign
        // await Campaign.create({
        //     to: to,
        //     subject: subject,
        //     emailBody: emailBody,
        //     isCampaignCreated: true,
        //     billId: billId,
        //     billTitle: billTitle,
        //     hearingDate: hearingDate
        // });

        // Send the campaign
        await mailchimp.campaigns.send(campaignId);

        console.log('Campaign sent successfully');
    } catch (error) {
        console.error('Error sending campaign:', error);
        throw error;
    }
}

module.exports = sendCampaign;
