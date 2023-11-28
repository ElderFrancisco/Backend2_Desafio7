const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  const filteredUser = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    rol: user.rol,
    cartId: user.cartId,
  };
  const token = jwt.sign({ user: filteredUser }, 'secret', {
    expiresIn: '24h',
  });
  return token;
};

const accessPublicWithoutAuth = (req, res, next) => {
  const token = req.cookies['cookieJWT'];
  if (!token) return next();

  jwt.verify(token, 'secret', (error, credentials) => {
    if (error) {
      res.clearCookie('cookieJWT');
      return next();
    }
    return res.redirect('/products');
  });
};

const authToHome = (req, res, next) => {
  const token = req.cookies['cookieJWT'];
  if (!token) {
    req.user = null;

    return next();
  }
  jwt.verify(token, 'secret', (error, credentials) => {
    if (error) {
      req.user = null;
      res.clearCookie('cookieJWT');
      return next();
    }
    req.user = credentials.user;

    return next();
  });
};
module.exports = { generateToken, accessPublicWithoutAuth, authToHome };
