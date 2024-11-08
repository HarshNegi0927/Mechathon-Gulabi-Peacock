const passport = require('passport');
const bcrypt = require('bcrypt');
const FormDataModel = require('../models/FormData');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const createToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Registration endpoint
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await FormDataModel.findOne({ email });
        if (existingUser) {
            return res.json("Already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await FormDataModel.create({ name, email, password: hashedPassword });

        req.login(newUser, (err) => {
            if (err) return res.status(500).json(err);
            res.json("Registered successfully!");
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// Local login endpoint
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.json(info.message);
        console.log(user)
        req.login(user, (err) => {
            if (err) return next(err);

            // Create a token and set it as an HTTP-only cookie
            const token = createToken(user);
            console.log(token)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            return res.json({ message: "Login successful" });
        });
    })(req, res, next);
};

// Google OAuth login endpoint
exports.googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

// Google OAuth callback endpoint
exports.googleCallback = (req, res) => {
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, () => {
        // Redirect to frontend with a successful Google login
        res.redirect('http://localhost:5173/home');
    });
};

// Logout endpoint to clear the cookie
exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    req.logout((err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Logged out successfully" });
    });
};
