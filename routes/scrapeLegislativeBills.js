const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const LegislativeBill = require('../models/LegislativeBill');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const url = 'https://mgaleg.maryland.gov/mgawebsite/Legislation/Index/senate';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    $('tbody tr').each((index, element) => {
      const columns = $(element).find('td');
      if (columns.length === 3) {
        const bill = $(columns[0]).find('a').text().trim();
        console.log(bill)
        const title = $(columns[1]).text().trim();
        const sponsor = $(columns[2]).find('a').text().trim();
        const currentStatus = '';  // You can extract this information from the website if available
        const orgCommitteesAndHearings = '';  // Similarly, extract these if available
        const oppoCommitteesAndHearings = '';  // Similarly, extract these if available

        LegislativeBill.findOneAndUpdate({ bill }, { title, sponsor, currentStatus, orgCommitteesAndHearings, oppoCommitteesAndHearings }, { upsert: true });
      }
    });

    res.send('Scraping and saving to MongoDB completed.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error scraping data.');
  }
});

module.exports = router;
