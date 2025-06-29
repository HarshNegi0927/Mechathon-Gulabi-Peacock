require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const path = require('path');
const connectDB = require('./config/db');
require('./config/passport');
const FormDataModel = require('./models/FormData'); // Ensure this is imported

const app = express();

// 🔌 Connect to MongoDB
connectDB();

// ⚙️ Trust proxy for production (IMPORTANT!)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// 🧩 Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'https://tick-tracker.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 💾 Session Configuration (FIXED)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax'
  }
}));

// 🔐 Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// 📁 Static File Serving
app.use('/uploads', express.static('uploads'));

// 🔍 Enhanced Debug Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    authenticated: req.isAuthenticated(),
    user: req.user?.id || 'none',
    sessionID: req.sessionID,
    hasJWTCookie: !!req.cookies.token,
    sessionExists: !!req.session,
    sessionPassport: req.session?.passport
  });
  next();
});

// 🔒 SIMPLIFIED Authentication Middleware (FIXED: now async)
const authMiddleware = async (req, res, next) => {
  console.log('Auth check for:', req.path);

  if (req.isAuthenticated()) {
    console.log('Authenticated via Passport session');
    return next();
  }

  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = await FormDataModel.findById(decoded.id);
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
    mongoConnected: process.env.MONGODB_URI ? 'URI Set' : 'URI Missing',
    trustProxy: app.get('trust proxy')
  });
});

// 🧪 Enhanced Test Auth Endpoint
app.get('/api/test-auth', (req, res) => {
  const token = req.cookies.token;
  let jwtDecoded = null;
  let jwtError = null;

  if (token) {
    try {
      jwtDecoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    } catch (error) {
      jwtError = error.message;
    }
  }

  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null,
    sessionID: req.sessionID,
    session: {
      exists: !!req.session,
      passport: req.session?.passport,
      cookie: req.session?.cookie
    },
    cookies: req.cookies,
    jwtDecoded: jwtDecoded,
    jwtError: jwtError,
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set',
    trustProxy: app.get('trust proxy'),
    headers: {
      'x-forwarded-proto': req.headers['x-forwarded-proto'],
      'x-forwarded-for': req.headers['x-forwarded-for']
    }
  });
});

// 📦 API Routes
app.use('/auth', require('./routes/authRoutes'));
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
    authenticated: req.isAuthenticated(),
    session: !!req.session
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
  console.log(`Trust Proxy: ${app.get('trust proxy')}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not Set'}`);
  console.log(`Session Secret: ${process.env.SESSION_SECRET ? 'Set' : 'Not Set'}`);
});
