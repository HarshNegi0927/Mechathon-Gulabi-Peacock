const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;  // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Authentication token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    // Attach user data to request object
    req.user = { _id: decoded._id }; // Assuming your token contains _id
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};




