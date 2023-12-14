const CartController = require('../controllers/Cart.controller');
const { Router } = require('express');

const cartController = new CartController();

module.exports = (app) => {
  let router = new Router();

  app.use('/cart', router);

  router.get('/:cid', cartController.renderGetCartById);
};
