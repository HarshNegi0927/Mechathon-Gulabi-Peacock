const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
      // Get the token from cookies
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Attach user information to the request
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
  
  