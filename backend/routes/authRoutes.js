const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { upload } = require('../controllers/authController');

// Enhanced authentication check middleware
const isAuthenticated = (req, res, next) => {
  console.log('Auth route check:', {
    path: req.path,
    isAuth: req.isAuthenticated(),
    hasUser: !!req.user,
    sessionID: req.sessionID
  });
  
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Check JWT as fallback (same as main auth middleware)
  const token = req.cookies.token;
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      // You'd need to fetch the user here too for consistency
      console.log('Auth route: JWT fallback successful');
      return next();
    } catch (error) {
      console.log('Auth route: JWT fallback failed:', error.message);
    }
  }
  
  res.status(401).json({ message: 'Not authenticated' });
};

// Public routes (no auth required)
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Google OAuth routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

// Protected routes (auth required)
router.get('/check', isAuthenticated, (req, res) => {
  res.status(200).json({ 
    message: 'Authenticated',
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

router.get('/user', isAuthenticated, authController.getUserProfile);

router.put('/update-profile', 
  isAuthenticated,
  upload.single('profilePicture'),
  authController.updateProfile
);

router.post('/logout', authController.logoutUser);

router.post('/change-password', isAuthenticated, authController.changePassword);

module.exports = router;
