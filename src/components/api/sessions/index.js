const { Router } = require('express');
const passport = require('passport');

module.exports = (app) => {
  let router = new Router();

  app.use('/api/session', router);

  router.post(
    '/login',
    passport.authenticate('login', { failureRedirect: '/authfailed' }),
    async (req, res) => {
      if (!req.user) {
        return res
          .status(400)
          .send({ status: error, error: 'credenciales invalidas' });
      }
      return res.cookie('cookieJWT', req.user.token).redirect('/products');
    },
  ),
    router.post(
      '/register',
      passport.authenticate('register', { failureRedirect: '/authfailed' }),
      async (req, res) => {
        return res.redirect('/login');
      },
    ),
    router.get(
      '/login-github',
      passport.authenticate('github', { scope: ['user:email'] }),
      async (req, res) => {},
    ),
    router.get(
      '/githubcallback',
      passport.authenticate('github', { failureRedirect: '/authfailed' }),
      async (req, res) => {
        return res.cookie('cookieJWT', req.user.token).redirect('/products');
      },
    ),
    router.get('/logout', async (req, res) => {
      try {
        if (req.cookies['cookieJWT']) {
          // Elimina la cookie
          res.clearCookie('cookieJWT').status(200).redirect('/');
        } else {
          res.status(400).redirect('/login');
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    });
};
