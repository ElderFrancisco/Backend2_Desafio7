const ProductController = require('../controllers/Product.controller');
const { Router } = require('express');
const passport = require('passport');

const productController = new ProductController();

module.exports = (app) => {
  let router = new Router();
  app.use('/products', router);

  router.get(
    '/',
    passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
    productController.renderGetProducts,
  );

  router.get(
    '/:pid',
    passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
    productController.renderGetProductById,
  );
};
