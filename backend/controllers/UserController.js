// controllers/userController.js
const User = require('../models/FormData');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject the file
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

// Upload handler
exports.uploadImage = async (req, res) => {
  try {
    // Assuming the user is authenticated and the user id is available in req.user
    const userId = req.user._id; // This assumes you have a way to get the authenticated user's ID, e.g., from a JWT token

    const imagePath = `/uploads/${req.file.filename}`;

    // Find the user and update the image field with the uploaded image path
    const user = await User.findByIdAndUpdate(
      userId,
      { image: imagePath }, // Update the image field with the new image path
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with a success message and the updated user information
    res.status(200).json({
      message: 'Image uploaded and user updated successfully!',
      imagePath: imagePath,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Export upload middleware
exports.uploadMiddleware = upload.single('image'); // Middleware to handle the image upload
