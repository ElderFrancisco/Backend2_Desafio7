const { Router } = require('express');
const passport = require('passport');

module.exports = (app) => {
  let router = new Router();

  app.use('/', router);

  router.get('/', async (req, res) => {
    try {
      const user = req.session.user;
      return res.render('index', { user });
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/register', async (req, res) => {
    try {
      if (req.session?.user) {
        return res.redirect('/products');
      }
      return res.render('register', {});
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/login', async (req, res) => {
    try {
      if (req.session?.user) {
        return res.redirect('/products');
      }
      return res.render('login', {});
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/authfailed', async (req, res) => {
    try {
      if (req.session?.user) {
        return res.redirect('/');
      }
      return res.render('authfailed', {});
    } catch (error) {
      console.log(error);
    }
  });

  router.get(
    '/private',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        return res.send({ status: 'success', payload: req.user });
      } catch (error) {
        console.log(error);
      }
    },
  );
};
