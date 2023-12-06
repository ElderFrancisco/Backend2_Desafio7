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
    async (req, res) => {
      try {
        const { user } = req.user;
        const productList = await productController.getProducts(req, res);
        // El problema esta en que devuelve res.status.json, en vez de los
        //productos
        res
          .status(200)
          .render('products', { products: productList, user: user });
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    },
  );

  router.get(
    '/:pid',
    passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
      try {
        const paramsID = req.params.pid;
        const productId = await productController.getProductById(paramsID);
        if (!productId) {
          return res
            .status(400)
            .send('no se econtro el producto con el ' + paramsID);
        }

        return res.status(200).render('productView', { product: productId });
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    },
  );
};
