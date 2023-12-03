const ProductManagerDb = require('../../dao/managersDb/ProductManagerDb');
const { Router } = require('express');
const passport = require('passport');
const ProductControllero = require('../../controllers/Product.controller');

const productController = new ProductManagerDb();
const productController1 = new ProductControllero();

module.exports = (app) => {
  let router = new Router();
  app.use('/api/products', router);

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      return productController1.getProducts(req, res);
    },
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      return productController1.addProduct(req, res);
    },
  );

  router.get(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      return productController1.getProductById(req, res);
    },
  );

  router.put('/:pid', async (req, res) => {
    try {
      const paramsID = req.params.pid;
      const body = req.body;
      const productUpdate = await productController.updateProduct(
        paramsID,
        body,
      );
      return res.status(200).json(productUpdate);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.delete('/:pid', async (req, res) => {
    try {
      const paramsID = req.params.pid;
      const productDeleted = await productController.deleteProduct(paramsID);
      return res.status(200).json(productDeleted);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
};
