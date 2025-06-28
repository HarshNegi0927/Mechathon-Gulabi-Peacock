// routes/userRoutes.js
const express = require('express');
const { uploadMiddleware, uploadImage } = require('../controllers/UserController');
const router = express.Router();

// Upload route
router.post('/upload', uploadMiddleware, uploadImage);

module.exports = router;
