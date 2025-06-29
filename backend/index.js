require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');
require('./config/passport');

const app = express();

// 🔌 Connect to MongoDB
connectDB();

// 🧩 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://tick-tracker.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 💾 Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// 🔐 Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// 📁 Static File Serving (uploads, images)
app.use('/uploads', express.static('uploads'));

// 📦 API Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/budget', require('./routes/expenseRoutes'));
app.use('/api/user', require('./routes/imageRoutes'));

// 🌐 Serve Frontend (Vite build output from ../frontend/dist)


// ⚠️ Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// 🚀 Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
