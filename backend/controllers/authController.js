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
      profilePicture: '/placeholder.svg' // Default profile picture
    });

    req.login(newUser, (err) => {
      if (err) return res.status(500).json(err);
      
      const token = createToken(newUser);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      res.json("Registered successfully!");
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json(error);
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json(info.message);

    req.login(user, (err) => {
      if (err) return next(err);
      
      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      return res.json("Login successful");
    });
  })(req, res, next);
};

exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleCallback = (req, res) => {
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, () => {
    const token = createToken(req.user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect('http://localhost:5173/dashboard');
  });
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await FormDataModel.findById(req.user._id)
      .select('-password -tokens');
    res.json(user);
  } catch (error) {
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
        updates.profilePicture = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;

      
      // Delete old profile picture if it exists and isn't the default
      const oldUser = await FormDataModel.findById(req.user._id);
      if (oldUser.profilePicture && 
          oldUser.profilePicture !== '/placeholder.svg' &&
          fs.existsSync(`.${oldUser.profilePicture}`)) {
        fs.unlinkSync(`.${oldUser.profilePicture}`);
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

exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  req.logout((err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Logged out successfully" });
  });
};

// New method for handling profile picture updates
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
    
    // Delete old profile picture if it exists and isn't the default
    const oldUser = await FormDataModel.findById(req.user._id);
    if (oldUser.profilePicture && 
        oldUser.profilePicture !== '/placeholder.svg' &&
        fs.existsSync(`.${oldUser.profilePicture}`)) {
      fs.unlinkSync(`.${oldUser.profilePicture}`);
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
    const { oldPassword, newPassword } = req.body;
    const user = await FormDataModel.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      // Configure your email service here
    });

    await transporter.sendMail({
      from: 'your-email@example.com',
      to: user.email,
      subject: 'Password Changed',
      text: 'Your password has been successfully changed.'
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

