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
// ✅ CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // must be set correctly in your .env
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
      secure: process.env.NODE_ENV === 'production', // true on Render
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
// ✅ Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/budget', require('./routes/expenseRoutes'));
app.use('/api/user', require('./routes/imageRoutes'));
// ✅ Serve frontend from "frontend/dist"
const __dirnameGlobal = path.resolve();
app.use(express.static(path.join(__dirnameGlobal, '../frontend/dict')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameGlobal, '../frontend/dict/index.html'));
});
// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});
// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
