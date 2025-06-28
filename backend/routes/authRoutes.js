// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const multer = require('multer');
// const path = require('path');
// const bcrypt = require('bcryptjs');

// // Local authentication routes
// router.post('/register', authController.registerUser); // Route for user registration
// router.post('/login', authController.loginUser); // Route for user login
// router.get('/check', (req, res) => {
//     if (req.isAuthenticated()) {
//         return res.status(200).json({ message: 'Authenticated' });
//     } else {
//         return res.status(401).json({ message: 'Not authenticated' });
//     }
// });
// router.get('/user', authController.getUserProfile);
// router.put('/update-profile', authController.updateProfile);

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: './uploads/profile-pictures',
//   filename: function(req, file, cb) {
//     cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1MB limit
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// });

// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// // Update profile picture
// router.post('/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
    
//     // Update user's profile picture URL in database
//     await db.query(
//       'UPDATE users SET profile_picture = $1 WHERE id = $2',
//       [profilePictureUrl, req.user.id]
//     );

//     res.json({ profilePictureUrl });
//   } catch (error) {
//     console.error('Error updating profile picture:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Change password
// router.post('/change-password', async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     // Get user from database
//     const user = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

//     // Verify current password
//     const isValid = await bcrypt.compare(currentPassword, user.rows[0].password);
//     if (!isValid) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Update password in database
//     await db.query(
//       'UPDATE users SET password = $1 WHERE id = $2',
//       [hashedPassword, req.user.id]
//     );

//     res.json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Google OAuth routes
// router.get('/google', authController.googleLogin); // Route to initiate Google login
// router.get('/google/callback', authController.googleCallback); // Route for Google callback after authentication
// router.post('/logout', authController.logoutUser);

// module.exports = router; // Export the router for use in app.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { upload } = require('../controllers/authController');

// Authentication check middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

// Auth routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/check', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
});
router.get('/user', isAuthenticated, authController.getUserProfile);
router.put('/update-profile', 
  isAuthenticated,
  upload.single('profilePicture'),
  authController.updateProfile
);
router.post('/logout', authController.logoutUser);
router.post('/change-password', authController.changePassword);

// Google OAuth routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
