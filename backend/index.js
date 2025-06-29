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
  origin: 'https://tick-tracker.onrender.com',
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

// 📁 Static File Serving
app.use('/uploads', express.static('uploads'));

// 🔍 Debug Middleware (temporary - for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    authenticated: req.isAuthenticated(),
    user: req.user?.id || 'none',
    sessionID: req.sessionID
  });
  next();
});

// 🔒 JWT Authentication Middleware
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('Auth check for:', req.path);
  
  // First check if Passport authenticated (for session-based auth)
  if (req.isAuthenticated()) {
    console.log('Authenticated via Passport session');
    return next();
  }
  
  // Then check for JWT token in cookies
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = decoded; // Set user from JWT payload
      console.log('Authenticated via JWT token, user:', decoded.id);
      return next();
    } catch (error) {
      console.log('JWT verification failed:', error.message);
    }
  }
  
  console.log('Authentication failed for:', req.path);
  res.status(401).json({ message: 'Unauthorized - Please log in' });
};

// 🌐 Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoConnected: process.env.MONGODB_URI ? 'URI Set' : 'URI Missing'
  });
});

// 🧪 Test Auth Endpoint (temporary - for debugging)
app.get('/api/test-auth', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null,
    sessionID: req.sessionID,
    cookies: req.cookies
  });
});

// 📦 API Routes
// Public routes (no auth required)
app.use('/auth', require('./routes/authRoutes'));

// Protected routes (auth required)
app.use('/api/budget', authMiddleware, require('./routes/budgetRoutes'));
app.use('/api/budget', authMiddleware, require('./routes/expenseRoutes'));
app.use('/api/user', authMiddleware, require('./routes/imageRoutes'));

// ⚠️ Enhanced Error Handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: req.user?.id || 'none',
    authenticated: req.isAuthenticated()
  });
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not Set'}`);
  console.log(`Session Secret: ${process.env.SESSION_SECRET ? 'Set' : 'Not Set'}`);
});