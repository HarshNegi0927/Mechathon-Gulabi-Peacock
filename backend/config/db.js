const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Web');
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;
