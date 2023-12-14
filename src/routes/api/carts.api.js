const { Router } = require('express');
const CartController = require('../../controllers/Cart.controller');

const cartController = new CartController();

module.exports = (app) => {
  let router = new Router();

  app.use('/api/carts', router);

  router.post('/', cartController.createNewCart);

  router.get('/:cid', cartController.getCartById);

  router.get('/', cartController.getCarts);

  router.post('/:cid/product/:pid', cartController.updateOneCartByIdProduct);

  router.delete('/:cid/product/:pid', cartController.deleteProductById);

  router.put('/:cid', cartController.updateManyProducts);

  router.delete('/:cid', cartController.emptyCartById);
};
