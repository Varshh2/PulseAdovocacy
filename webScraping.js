const axios = require('axios');
const cheerio = require('cheerio');
const MyMGA = require('./models/MyMGA'); // Import your Mongoose model

const baseURL = 'https://mgaleg.maryland.gov';

// Function to scrape and save data
async function scrapeAndSave() {
    try {
        const response = await axios.get('https://mgaleg.maryland.gov/mgawebsite/Legislation/Index/senate');
        const $ = cheerio.load(response.data);

        // Loop through each table row and extract data
        $('div.hide-on-mobile tbody tr').each(async (index, element) => {

            const billChapterLink = $(element).find('td:nth-child(1) a').first(); // Select the first anchor tag for bill chapter
            const billChapter = billChapterLink.text().trim();
            const billChapterRelativeURL = billChapterLink.attr('href');
            const billChapterHyperlink = baseURL + billChapterRelativeURL;

            let crossChapter = '';
            let crossChapterHyperlink = '';

            const crossChapterLink = $(element).find('td:nth-child(1) a').eq(1); // Select the second anchor tag for cross chapter
            if (crossChapterLink.length) {
                crossChapter = crossChapterLink.text().trim();
                const crossChapterRelativeURL = crossChapterLink.attr('href');
                crossChapterHyperlink = baseURL + crossChapterRelativeURL;
            }

            const title = $(element).find('td:nth-child(2)').text().trim();
            const sponsor = $(element).find('td:nth-child(3) a').text().trim();
            const currentStatus = $(element).find('td:nth-child(6)').text().trim();
            const orgCommitteesHearings = $(element).find('td:nth-child(7) dl dd a').text().trim();
            const orgCommitteesHearingsDate = $(element).find('td:nth-child(7) dl').text().trim().split('\n').slice(1).join('\n');
            const oppCommitteesHearings = $(element).find('td:nth-child(8) dl dd a').text().trim();
            const oppCommitteesHearingsDate = $(element).find('td:nth-child(8) dl').text().trim().split('\n').slice(1).join('\n');

            // Check if the bill number already exists in the database
            const existingEntry = await MyMGA.findOne({ billChapter });

            if (existingEntry) {
                console.log(`Duplicate entry found for bill number: ${billChapter}. Skipping...`);
                return; // Skip saving this entry
            }

            // Create a new instance of MyMGA model
            const myMGAData = new MyMGA({
                billChapter: billChapter,
                billChapterHyperlink,
                crossChapter,
                crossChapterHyperlink,
                title,
                sponsor,
                currentStatus,
                orgCommittees: orgCommitteesHearings,
                orgCommitteesHearingsDate,
                oppCommittees: oppCommitteesHearings,
                oppCommitteesHearingsDate
            });
            // Save the instance to the database
            try {
                await myMGAData.save();
                console.log('Data saved successfully:', myMGAData);
            } catch (error) {
                console.error('Error saving data:', error);
            }

        });
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    }
}

// Call the function to scrape and save data
module.exports = scrapeAndSave;
