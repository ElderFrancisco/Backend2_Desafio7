const ProductServices = require('./services/Product.Services');
const bodyParser = require('body-parser');

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
function getParams(req) {
  const p = req.params;
  const PId = p.pid;
  const parametros = {
    PId,
  };
  return parametros;
}
function getUrl(params, path, number) {
  const nextPage = parseInt(params.page) + number;

  let url = `${path}?page=${nextPage >= 1 ? nextPage : 1}`;
  if (params.limit !== 10) {
    url += `&limit=${params.limit}`;
  }
  if (params.query != null) {
    url += `&query=${JSON.stringify(params.query)}`;
  }
  if (params.sort != null) {
    url += `&sort=${JSON.stringify(params.sort)}`;
  }
  return url;
}

const ProductServicesManager = new ProductServices();

class ProductControllero {
  async getProducts(req, res) {
    try {
      const pathUrl = getPathUrl(req);
      const params = getQueryParams(req);
      const productsList = await ProductServicesManager.getProducts(params);
      const urlPrev = getUrl(params, pathUrl, -1);
      const urlNext = getUrl(params, pathUrl, +1);
      const result = {
        status: 'success',
        payload: productsList.docs,
        totalPages: productsList.totalPages,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        page: productsList.page,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevLink: productsList.hasPrevPage == true ? urlPrev : null,
        nextLink: productsList.hasNextPage == true ? urlNext : null,
      };
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      const result = {
        status: 'error',
        payload: productsList.docs,
        totalPages: productsList.totalDocs,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        page: productsList.page,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevLink: productsList.hasPrevPage == true ? urlPrev : null,
        nextLink: productsList.hasNextPage == true ? urlNext : null,
      };
      return res.status(500).send(result);
    }
  }

  async addProduct(req, res) {
    try {
      const body = req.body;
      const title = body.title;
      const description = body.description;
      const price = body.price;
      const thumbnail = Array.isArray(body.thumbnail) ? body.thumbnail : [];
      const code = body.code;
      const stock = body.stock;
      const category = body.category;
      const status = body.status === false ? false : true;

      if (!title || !description || !price || !category || !code || !stock) {
        console.log(
          `Por favor complete todos los campos solicitados de ${title}`,
        );
        return res.status(400).json({ error: 'Ingrese todos los campos' });
      } else {
        const product = {
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        };
        const NewProduct = await ProductServicesManager.createProduct(product);
        return res.status(201).json({ status: 'success', payload: NewProduct });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getProductById(req, res) {
    try {
      const params = getParams(req);
      const field = '_id';
      const id = params.PId;
      const productId = await ProductServicesManager.findProduct(field, id);
      if (productId == null) {
        return res
          .status(401)
          .json({ status: 'error', error: 'product not found' });
      }
      return res.status(200).json({ status: 'success', payload: productId });
    } catch (error) {
      console.log('error en getproductById' + error);
    }
  }
}

module.exports = ProductControllero;
