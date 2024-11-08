const passport = require('passport');
const bcrypt = require('bcrypt');
const FormDataModel = require('../models/FormData');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const createToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Local strategy
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await FormDataModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'No records found!' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Wrong password' });
            }

            // console.log(user)
            return done(null, user);
        } catch (error) {
            console.log("hhasdinh")
            return done(error);
        }
    })
);

// Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3001/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await FormDataModel.findOne({ email: profile.emails[0].value });
                if (!user) {
                    user = await FormDataModel.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await FormDataModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
