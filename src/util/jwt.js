const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  const token = jwt.sign({ user }, 'secret', { expiresIn: '24h' });
  return token;
};

const authToken = (req, res, next) => {
  const token = req.cookies['cookieJWT'];
  console.log({ token });
  if (!token) return res.status(401).send({ error: 'noAuth' });

  jwt.verify(token, 'secret', (error, credentials) => {
    if (error) return res.status(403).send({ error: 'no Autorizado' });
    req.user = credentials.user;
    next();
  });
};
module.exports = { generateToken, authToken };
