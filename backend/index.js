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

// ✅ Connect MongoDB
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS - Updated for separate frontend deployment
app.use(
  cors({
    origin: [
      'http://localhost:3000',  // Local development
      'http://localhost:5173',  // Vite dev server
      process.env.FRONTEND_URL  // Production frontend URL (will be Vercel)
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ✅ Auth
app.use(passport.initialize());
app.use(passport.session());

// ✅ Uploads folder (if you store images or files)
app.use('/uploads', express.static('uploads'));

// ✅ API Health Check - NEW
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Tracker API is running!', 
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ API Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/budget', require('./routes/expenseRoutes'));
app.use('/api/user', require('./routes/imageRoutes'));

// ✅ Handle 404 for API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

app.use('/auth/*', (req, res) => {
  res.status(404).json({ 
    message: 'Auth endpoint not found',
    path: req.originalUrl
  });
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend API running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
});
