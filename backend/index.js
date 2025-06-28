// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const passport = require('passport');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
// const connectDB = require('./config/db'); 
// require('./config/passport'); 
// const budgetRoutes = require('./routes/budgetRoutes');
// const app = express();
// const ExpenseRoutes = require('./routes/expenseRoutes')
// // import authenticateToken from './Middleware/authMiddleware';
// // const authenticateToken = require('./Middleware/authMiddleware')
// const imageRoutes = require('./routes/imageRoutes')

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:5173', 
    
//     credentials: true 
// }));


// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI, 
//         collectionName: 'sessions'
//     }),
//     cookie: {
//         httpOnly: true, 
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 1000 * 60 * 60 * 24, // 1 day
//         // sameSite: 'None',
//     }
// }));

// // Initialize Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // MongoDB connection
// connectDB();

// // Routes
// app.use('/auth', require('./routes/authRoutes'));
// app.use('/api/budget',budgetRoutes);
// app.use('/api/budget',ExpenseRoutes);
// app.use('/api/users',imageRoutes)





// app.listen(3001, () => {
//     console.log("Server listening on http://127.0.0.1:3001");
// });
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
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 💾 Session config
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
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// 🔐 Passport auth
app.use(passport.initialize());
app.use(passport.session());

// 📁 Serve static files like uploaded images
app.use('/uploads', express.static('uploads'));

// 📦 API Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/budget', require('./routes/expenseRoutes'));
app.use('/api/user', require('./routes/imageRoutes'));

// 🌐 Serve Frontend (after all APIs)
const __dirnameGlobal = path.resolve();
app.use(express.static(path.join(__dirnameGlobal, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameGlobal, '../frontend/dist/index.html'));
});

// ⚠️ Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// 🚀 Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
