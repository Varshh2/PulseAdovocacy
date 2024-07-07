// subscribedUser.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscribedUserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: String,
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const SubscribedUser = mongoose.model('SubscribedUser', subscribedUserSchema);

module.exports = SubscribedUser;
