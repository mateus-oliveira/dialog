const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpStatus = require('../constants/httpStatus')
const User = require('../models/User');


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    user.password = undefined;
    return res.status(httpStatus.HTTP_201_CREATED).json(user);
  } catch (err) {
    return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(httpStatus.HTTP_401_UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(httpStatus.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(httpStatus.HTTP_404_NOT_FOUND).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(httpStatus.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};

