const passport = require('passport');
const bcrypt = require('bcrypt');
const FormDataModel = require('../models/FormData');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

exports.upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter
});

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.json("Already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await FormDataModel.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: '/placeholder.svg'
    });

    // FIXED: Use session-based auth primarily
    req.login(newUser, (err) => {
      if (err) {
        console.error('Login error after registration:', err);
        return res.status(500).json({ message: 'Registration successful but login failed' });
      }
      
      // Optional: Still create JWT for API clients
      const token = createToken(newUser);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      console.log('Registration successful, user logged in:', newUser._id);
      res.json("Registered successfully!");
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.loginUser = (req, res, next) => {
  console.log('Login attempt for:', req.body.email);
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Passport authentication error:', err);
      return next(err);
    }
    
    if (!user) {
      console.log('Authentication failed:', info?.message);
      return res.status(401).json({ message: info?.message || 'Authentication failed' });
    }

    // FIXED: Ensure session login works properly
    req.login(user, (err) => {
      if (err) {
        console.error('Session login error:', err);
        return next(err);
      }
      
      // Create JWT as backup/for API clients
      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      console.log('Login successful for user:', user._id);
      console.log('Session ID:', req.sessionID);
      console.log('Session:', req.session);
      
      return res.json({ 
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    });
  })(req, res, next);
};

exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleCallback = (req, res) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google auth error:', err);
      return res.redirect('https://tick-tracker.onrender.com/login?error=auth_failed');
    }
    
    if (!user) {
      console.log('Google auth failed:', info);
      return res.redirect('https://tick-tracker.onrender.com/login?error=auth_failed');
    }
    
    req.login(user, (err) => {
      if (err) {
        console.error('Google login session error:', err);
        return res.redirect('https://tick-tracker.onrender.com/login?error=session_failed');
      }
      
      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      console.log('Google login successful for user:', user._id);
      res.redirect('https://tick-tracker.onrender.com/dashboard');
    });
  })(req, res);
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await FormDataModel.findById(req.user._id)
      .select('-password -tokens');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const updates = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    // Handle profile picture update if present
    if (req.file) {
      updates.profilePicture = `https://mechathon-gulabi-peacock-10.onrender.com/uploads/${req.file.filename}`;
      
      // Delete old profile picture if it exists and isn't the default
      const oldUser = await FormDataModel.findById(req.user._id);
      if (oldUser.profilePicture && 
          oldUser.profilePicture !== '/placeholder.svg' &&
          !oldUser.profilePicture.includes('placeholder')) {
        const oldFilePath = path.join(uploadDir, path.basename(oldUser.profilePicture));
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const user = await FormDataModel.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -tokens');

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ message: 'Error updating profile' });
  }
};

// FIXED: Better logout handling
exports.logoutUser = (req, res) => {
  console.log('Logout request for user:', req.user?.id);
  
  // Clear JWT cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax'
  });
  
  // Clear session
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Destroy session completely
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: 'Session cleanup failed' });
      }
      
      console.log('Logout successful');
      res.json({ message: "Logged out successfully" });
    });
  });
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePicturePath = `https://mechathon-gulabi-peacock-10.onrender.com/uploads/${req.file.filename}`;
    
    // Delete old profile picture if it exists and isn't the default
    const oldUser = await FormDataModel.findById(req.user._id);
    if (oldUser.profilePicture && 
        oldUser.profilePicture !== '/placeholder.svg' &&
        !oldUser.profilePicture.includes('placeholder')) {
      const oldFilePath = path.join(uploadDir, path.basename(oldUser.profilePicture));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const user = await FormDataModel.findByIdAndUpdate(
      req.user._id,
      { profilePicture: profilePicturePath },
      { new: true }
    ).select('-password -tokens');

    res.json(user);
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { oldPassword, newPassword } = req.body;
    const user = await FormDataModel.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};
