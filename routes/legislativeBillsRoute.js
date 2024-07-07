const express = require('express');
const router = express.Router();
const MyMGA = require('../models/MyMGA');
const SubscribedUser = require('../models/subscribedUser');
const Campaign = require('../models/campaign');


// GET route for listing legislative bills
router.get('/', async (req, res) => {
    try {
        // Fetch all legislative bills from MyMGA
        const legislativeBills = await MyMGA.find().sort({ createdAt: -1 }).limit(10);

        // Check if either billChapter or crossChapter is present in the campaigns model for each bill
        for (const bill of legislativeBills) {
            const campaign = await Campaign.findOne({
                $or: [
                    { billChapter: bill.billChapter },
                    { crossChapter: bill.crossChapter }
                ]
            }).exec();
            bill.hasCampaign = campaign ? true : false;
        }

        res.render('legislativeBills', { legislativeBills });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching legislative bills');
    }
});
// GET route for creating a campaign
router.get('/createCampaign', async (req, res) => {
    try {
        const billId = req.query.billId;
        console.log(billId);
        // Fetch bill details from MyMGA model using billId
        const bill = await MyMGA.findById(billId).exec();
        console.log(bill);
        // Fetch subscribed user email(s) based on the location's zip code
        const users = await SubscribedUser.find({ pincode: bill.location.zip });
        console.log(users);
        // Extract email addresses into an array
        const userEmails = users.map(user => user.email);

        // Construct subject using bill title and dateOfHearing
        const subject = `${bill.title} - Hearing`;

        // Construct email template
        let emailTemplate = `Dear Supporter's,

We hope this message finds you in good spirits.

We're writing to remind you of the upcoming hearing for the ${bill.title} bill. This is a pivotal moment where your voice can make a significant impact on the future of our cause.

Here are the essential details you need to know:

Campaign: ${bill.title}
`;

        if (bill.orgCommitteesHearingsDate) {
            emailTemplate += `Hearing Date And Time Of Hearing: ${bill.orgCommitteesHearingsDate}\n`;
        }

        emailTemplate += `Location/Platform: ${bill.location.address1}, ${bill.location.city}, ${bill.location.state} ${bill.location.zip}

Your presence at this hearing is crucial. Your support has brought us this far, and now, your testimony can drive our campaign forward. Together, we can ensure that our voices are heard loud and clear by decision-makers.

Your input will shape the outcome of this bill, and ultimately, the future of our cause. We urge you to mark your calendar and join us for this critical event.

Thank you for your unwavering support and dedication to ${bill.title}. We look forward to standing alongside you at the hearing.

Warm regards,
`;

        // Render the 'createCampaign' view with data, including billId, subject, and emailTemplate
        res.render('createCampaign', { billId, subject, userEmails, emailTemplate }); // Pass billId to the view
    } catch (err) {
        // Handle error
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'majrpulseadv@gmail.com',
        pass: 'hokmjrkdemiwyhxy'
    }
});

router.post('/sendEmail', async (req, res) => {
    try {
        const { to, subject, contentTemplate, billId } = req.body;
        console.log(to);
        // Ensure billId is valid
        if (!billId) {
            return res.status(400).send('Bill ID is required');
        }
        const toEmails = to.split(',').map(email => email.trim());

        // Fetch bill details from MyMGA model using billId
        const bill = await MyMGA.findById(billId).exec();
        console.log(bill)
        // Construct email message
        const mailOptions = {
            from: '',
            to: toEmails, // or use an array if sending to multiple recipients: [to1, to2, ...]
            subject: subject,
            text: contentTemplate // or use html: emailBody if sending HTML content
        };

        // Send email
        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                // Update campaign entry in the database
                try {
                    const campaign = new Campaign({
                        to: toEmails,
                        subject: subject,
                        emailBody: contentTemplate.replace(/\r?\n|\r/g, ''),
                        isCampaignCreated: true, // Marking campaign as created
                        billChapter: bill.billChapter,
                        billChapterHyperlink: bill.billChapterHyperlink,
                        crossChapter: bill.crossChapter,
                        crossChapterHyperlink: bill.crossChapterHyperlink,
                        billTitle: bill.title, // Assuming title is stored in 'title' field of MyMGA model
                        hearingDate: bill.dateOfHearing // Assuming hearing date is stored in 'hearingDate' field of MyMGA model
                    });
                    await campaign.save();

                    // Redirect to the campaign list page
                    res.redirect('/campaigns');
                } catch (error) {
                    console.error('Error updating campaign in database:', error);
                    res.status(500).send('Error updating campaign in database');
                }
            }
        });
    } catch (error) {
        console.error('Error creating and sending campaign:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
