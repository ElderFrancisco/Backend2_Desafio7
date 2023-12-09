const CartManagerDb = require('../../dao/managersDb/CartManagerDb');
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
  /*
  router.delete('/:cid/product/:pid', async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const updatedCart = await cartController.deleteProductCart(cid, pid);
      res.send(updatedCart);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.put('/:cid', async (req, res) => {
    try {
      const params = req.params;
      const body = req.body;
      const updatedCart = await cartController.addProdcutBodyCart(params, body);
      res.status(200).send(updatedCart);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const params = req.params;
      const body = req.body;
      const updatedCart = await cartController.addProdcutBodyCart(params, body);
      res.status(200).send(updatedCart);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.delete('/:cid', async (req, res) => {
    try {
      const params = req.params;
      const deleteProductCart = await cartController.emptyCart(params);
      res.status(200).send(deleteProductCart);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  */
};
