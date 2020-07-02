const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'No token, Authorization denied' }] });
  }

  try {
    let decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (e) {
    res
      .status(401)
      .json({ errors: [{ msg: 'Invalid token, Authorization denied' }] });
  }
};
