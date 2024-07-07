const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  to: { type: [String], required: true }, // Array of email addresses
  subject: { type: String, required: true },
  emailBody: { type: String, required: true },
  isCampaignCreated: { type: Boolean, default: false },
  dateTime: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyMGA' }, // Reference to the associated bill
  billTitle: { type: String, required: true }, // Title of the associated bill
  hearingDate: { type: Date, required: false }, // Hearing date of the associated bill
  billChapter: {
    type: String,
  },
  billChapterHyperlink: {
    type: String,
  },
  crossChapter: {
    type: String,
  },
  crossChapterHyperlink: {
    type: String,
  },
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
