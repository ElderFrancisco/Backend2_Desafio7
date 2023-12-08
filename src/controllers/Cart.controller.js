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
          .json({ status: 'error', error: 'product not found' });
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
}

module.exports = CartController;
