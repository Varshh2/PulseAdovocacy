const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/users');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const LegislativeBill = require('./models/LegislativeBill');
const methodOverride = require('method-override');



// Connect to MongoDB
mongoose.connect('mongodb+srv://varshvr:Marlboro123%40@cluster0.h2oxtjs.mongodb.net/pulseAdvocacy', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/models')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport.js configuration
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, 'src', 'assets')));

// Routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Login routes
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

// Register routes
const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

// Forgot password routes
const forgotPasswordRouter = require('./routes/forgotpassword');
app.use('/forgot-password', forgotPasswordRouter);

// Dashboard route
const dashboardRouter = require('./routes/dashboard');
app.use('/dashboard', dashboardRouter);

// Subscribed users routes
const subscribedUsersRouter = require('./routes/subscribedUserroute');
app.use('/subscribedUsers', subscribedUsersRouter);

// Legislative bill routes
const legislativeBillsRouter = require('./routes/legislativeBillsRoute');
app.use('/legislativeBills', legislativeBillsRouter);

// New route for scraping legislative bills
const scrapeLegislativeBillsRouter = require('./routes/scrapeLegislativeBills');
app.use('/scrapeLegislativeBills', scrapeLegislativeBillsRouter);


// Campaigns route
const campaignRoute = require('./routes/campaign');
app.use('/campaigns', campaignRoute);


const resetPasswordRoute = require('./routes/resetPassword');
app.use('/resetPassword', resetPasswordRoute);

// Redirect to login page for any unknown routes
// app.get('*', (req, res) => {
//  res.redirect('/login');
// });

// Middleware to override form methods
//app.use(methodOverride('_method'));



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
