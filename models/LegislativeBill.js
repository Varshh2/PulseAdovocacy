const mongoose = require('mongoose');

const legislativeBillSchema = new mongoose.Schema({
  bill: { type: String, unique: true },
  title: String,
  sponsor: String,
  currentStatus: String,
  orgCommittees: String,
  orgCommitteesHearingsDate: String,
  oppCommittees: String,
  oppCommitteesHearingsDate: String
});

const LegislativeBill = mongoose.model('LegislativeBill', legislativeBillSchema);

module.exports = LegislativeBill;
