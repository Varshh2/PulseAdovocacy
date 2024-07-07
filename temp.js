const User = require('./models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createSampleUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://varshvr:Marlboro123%40@cluster0.h2oxtjs.mongodb.net/pulseAdvocacy', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existingUser = await User.findOne({ username: 'sampleUser' });
        if (!existingUser) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash('samplePassword', saltRounds);
            const newUser = new User({
                username: 'sampleUser',
                password: hashedPassword
            });
            await newUser.save();
            console.log('Sample user created successfully');
        } else {
            console.log('Sample user already exists');
        }

        // Disconnect from MongoDB
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error creating sample user:', error);
    }
}

createSampleUser();
