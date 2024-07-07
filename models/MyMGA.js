// Inside MyMGA.js
const mongoose = require('mongoose');

const myMGASchema = new mongoose.Schema({
    billChapter: {
        type: String,
        required: true
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
    title: {
        type: String,
        required: true
    },
    location: {
        address1: {
            type: String,
            default: '11 Bladen St'
        },
        address2: {
            type: String,
            default: 'James Senate Office Building'
        },
        city: {
            type: String,
            default: 'Annapolis'
        },
        state: {
            type: String,
            default: 'MD'
        },
        country: {
            type: String,
            default: 'United States' // Set your desired default country value
        },
        zip: {
            type: String,
            default: '21401'
        }
    },
    sponsor: String,
    currentStatus: String,
    orgCommittees: String,
    orgCommitteesHearingsDate: String,
    oppCommittees: String,
    oppCommitteesHearingsDate: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MyMGA = mongoose.model('MyMGA', myMGASchema);

module.exports = MyMGA;
