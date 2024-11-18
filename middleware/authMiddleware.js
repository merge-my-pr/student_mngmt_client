const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];  // Split "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'No token provided, access denied.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use the secret key from .env
    req.user = decoded;  // Attach user info to the request object
    next();  // Continue to the next middleware/handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
