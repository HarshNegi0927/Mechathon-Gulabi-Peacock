const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Local authentication routes
router.post('/register', authController.registerUser); // Route for user registration
router.post('/login', authController.loginUser); // Route for user login
router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        // console.log("yes")
        return res.status(200).json({ message: 'Authenticated' });
    } else {
        // console.log("no")
        return res.status(401).json({ message: 'Not authenticated' });
    }
});

// Google OAuth routes
router.get('/google', authController.googleLogin); // Route to initiate Google login
router.get('/google/callback', authController.googleCallback); // Route for Google callback after authentication
router.post('/logout',authController.logoutUser)
module.exports = router; // Export the router for use in app.js
