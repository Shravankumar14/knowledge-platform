const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>" → take the token part

  try {
    // 2. Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the decoded user info to the request object
    req.user = decoded; // { id, role }

    next(); // move on to the actual route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const instructorOnly = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied: instructors only' });
  }
  next();
};

module.exports = { protect, instructorOnly };

