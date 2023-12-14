const CartServices = require('../services/cart.services');

const CartServicesManager = new CartServices();

function getQueryParams(req) {
  const p = req.query;
  const limit = parseInt(p.limit) || 10;
  const page = p.page || 1;
  const params = {
    limit,
    page,
  };
  return params;
}
function getPathUrl(req) {
  const currentPath = req.originalUrl;
  const index = currentPath.indexOf('?');
  if (index !== -1) {
    const a = currentPath.substring(0, index);
    return a;
  } else {
    return currentPath;
  }
}

class CartController {
  async createNewCart(req, res) {
    try {
      const productsBody = Array.isArray(req.body.products)
        ? req.body.products
        : [];
      const products = productsBody.filter((e) => e.product && e.quantity);
      const result = await CartServicesManager.createNewCart(products);
      if (!result) return res.status(400).json({ status: 'error' });
      return res.status(201).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async getCartById(req, res) {
    try {
      const cid = req.params.cid;
      const result = await CartServicesManager.getCartById(cid);

      if (!result) {
        return res
          .status(404)
          .json({ status: 'error', error: 'Cart not found' });
      }
      return res.status(200).json({ status: 'Success', payload: result });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCarts(req, res) {
    try {
      const pathUrl = getPathUrl(req);
      const params = getQueryParams(req);
      const result = await CartServicesManager.getCarts(params, pathUrl);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }
  async updateOneCartByIdProduct(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const result = await CartServicesManager.updateOneCart(cid, pid);
      if (!result) {
        return res.status(404).json({ Status: 'Error' });
      }
      return res.status(201).json({ status: 'Success', payload: result });
    } catch (error) {
      onsole.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }
  async deleteProductById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const result = await CartServicesManager.deleteProductCart(cid, pid);
      if (!result) {
        return res
          .status(404)
          .json({ status: 'Error', Error: 'Cart Id or Product Id not found' });
      }
      return res.status(201).json({ status: 'Success', payload: result });
    } catch (error) {
      onsole.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }
  async updateManyProducts(req, res) {
    try {
      const cid = req.params.cid;
      const productsBody = Array.isArray(req.body.products)
        ? req.body.products
        : [];
      const products = productsBody.filter((e) => e.product && e.quantity);

      const result = await CartServicesManager.updateManyProducts(
        cid,
        products,
      );
      if (!result) {
        return res
          .status(404)
          .json({ status: 'Error', Error: 'Cart Id or Product Id not found' });
      }
      return res.status(201).json({ status: 'Success', payload: result });
    } catch (error) {
      onsole.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async emptyCartById(req, res) {
    try {
      const cid = req.params.cid;
      const result = await CartServicesManager.emptyCartById(cid);
      if (!result) {
        return res
          .status(404)
          .json({ status: 'Error', Error: 'Cart Id not found' });
      }
      return res.status(201).json({ status: 'Success', payload: result });
    } catch (error) {
      onsole.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async renderGetCartById(req, res) {
    try {
      const cid = req.params.cid;
      const result = await CartServicesManager.getCartById(cid);

      if (!result) {
        return res
          .status(404)
          .json({ status: 'error', error: 'Cart not found' });
      }
      return res.status(200).render('cartView', { cart: result });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = CartController;
