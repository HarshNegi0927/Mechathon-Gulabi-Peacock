require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db'); // Make sure this connects to MongoDB
require('./config/passport'); // Import Passport strategies here

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true // Allow credentials (cookies) to be sent in requests
}));

// Initialize session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, // Your MongoDB URI for storing sessions
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true, // Helps prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // Set secure to true in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
connectDB();

// Routes
app.use('/auth', require('./routes/authRoutes'));

// Start the server
app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
