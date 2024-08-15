const jwt = require('jsonwebtoken');
const status = require('../constants/httpStatus');
const User = require('../models/User');


const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(status.HTTP_401_UNAUTHORIZED).json({ message: 'Access token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(status.HTTP_401_UNAUTHORIZED).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(status.HTTP_403_FORBIDDEN).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
