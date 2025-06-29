const passport = require('passport');
const bcrypt = require('bcrypt');
const FormDataModel = require('../models/FormData');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
  limits: { fileSize: 1000000 },
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

    req.login(newUser, (err) => {
      if (err) {
        console.error('Login error after registration:', err);
        return res.status(500).json({ message: 'Registration successful but login failed' });
      }

      const token = createToken(newUser);
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json("Registered successfully!");
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Authentication failed' });

    req.login(user, (err) => {
      if (err) return next(err);

      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });

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
    if (err || !user) return res.redirect('https://tick-tracker.onrender.com/login?error=auth_failed');

    req.login(user, (err) => {
      if (err) return res.redirect('https://tick-tracker.onrender.com/login?error=session_failed');

      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect('https://tick-tracker.onrender.com/dashboard');
    });
  })(req, res);
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const user = await FormDataModel.findById(req.user._id).select('-password -tokens');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const updates = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    if (req.file) {
      updates.profilePicture = `https://mechathon-gulabi-peacock-10.onrender.com/uploads/${req.file.filename}`;

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

    const user = await FormDataModel.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password -tokens');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });

  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Session cleanup failed' });
      res.json({ message: "Logged out successfully" });
    });
  });
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profilePicturePath = `https://mechathon-gulabi-peacock-10.onrender.com/uploads/${req.file.filename}`;
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
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const { oldPassword, newPassword } = req.body;
    const user = await FormDataModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
};
