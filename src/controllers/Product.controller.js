const ProductServices = require('../services/product.services');
const allowedFields = [
  'title',
  'description',
  'price',
  'thumbnail',
  'code',
  'stock',
  'category',
  'status',
];

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
function getQueryParams(req) {
  const p = req.query;
  const limit = parseInt(p.limit) || 10;
  const page = p.page || 1;
  const pquery = p.query;
  const psort = p.sort;
  const query = (() => {
    try {
      return JSON.parse(pquery);
    } catch (error) {
      return null;
    }
  })();

  const sort = (() => {
    try {
      return JSON.parse(psort);
    } catch (error) {
      return null;
    }
  })();
  const params = {
    limit,
    page,
    query,
    sort,
  };
  return params;
}
function getProductByBody(req) {
  const body = req.body;
  const title = body.title;
  const description = body.description;
  const price = body.price;
  const thumbnail = Array.isArray(body.thumbnail) ? body.thumbnail : [];
  const code = body.code;
  const stock = body.stock;
  const category = body.category;
  const status = body.status === false ? false : true;
  const productBody = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status,
  };
  return productBody;
}

const ProductServicesManager = new ProductServices();

class ProductController {
  async getProducts(req, res) {
    try {
      const pathUrl = getPathUrl(req);
      const params = getQueryParams(req);
      const result = await ProductServicesManager.getProducts(params, pathUrl);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async addProduct(req, res) {
    try {
      const productBody = getProductByBody(req);
      if (
        !productBody.title ||
        !productBody.description ||
        !productBody.price ||
        !productBody.category ||
        !productBody.code ||
        !productBody.stock
      ) {
        console.log(
          `Por favor complete todos los campos solicitados de ${title}`,
        );
        return res.status(400).json({ error: 'Ingrese todos los campos' });
      } else {
        const NewProduct = await ProductServicesManager.createProduct(
          productBody,
        );
        return res.status(201).json({ status: 'success', payload: NewProduct });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async getProductById(req, res) {
    try {
      const Id = req.params.pid;
      const productId = await ProductServicesManager.findProductById(Id);
      if (productId == null) {
        return res
          .status(404)
          .json({ status: 'error', error: 'product not found' });
      }
      return res.status(200).json({ status: 'success', payload: productId });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async updateProductById(req, res) {
    try {
      const Id = req.params.pid;
      const body = req.body;
      const productToUpdate = await ProductServicesManager.findProductById(Id);
      if (!productToUpdate) {
        return res
          .status(404)
          .json({ status: 'error', error: 'Product not found' });
      }
      const updatedProduct = {};

      allowedFields.forEach((campo) => {
        if (campo !== undefined) {
          updatedProduct[campo] = body[campo];
        } else {
          updatedProduct[campo] = productToUpdate[campo];
        }
      });
      const result = await ProductServicesManager.findByIdAndUpdate(
        Id,
        updatedProduct,
      );
      return res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(req, res) {
    try {
      const Id = req.params.pid;
      const productDelete = await ProductServicesManager.findByIdAndDelete(Id);
      if (productDelete.deletedCount === 1) {
        return res
          .status(204)
          .json({ status: 'Success', message: 'Product deleted successfully' });
      }
      return res
        .status(404)
        .json({ status: 'Error', error: 'Product not found' });
    } catch (error) {
      console.log(error);
    }
  }
  async renderGetProducts(req, res) {
    try {
      const pathUrl = getPathUrl(req);
      const params = getQueryParams(req);
      const { user } = req.user;
      const productList = await ProductServicesManager.getProducts(
        params,
        pathUrl,
      );
      if (productList.status == 'error') {
        return res.status(500).json({ status: 'error' });
      }
      return res
        .status(200)
        .render('products', { products: productList, user: user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }

  async renderGetProductById(req, res) {
    try {
      const Id = req.params.pid;
      const productId = await ProductServicesManager.findProductById(Id);
      if (productId == null) {
        return res
          .status(404)
          .json({ status: 'error', error: 'product not found' });
      }
      return res.status(200).render('productView', { product: productId });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'error' });
    }
  }
}

module.exports = ProductController;
