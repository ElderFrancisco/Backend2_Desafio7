const ProductServices = require('./services/Product.Services');
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
function createResult(doc, state, urlPrev, urlNext) {
  const result = {
    status: state,
    payload: doc.docs,
    totalPages: doc.totalPages,
    prevPage: doc.prevPage,
    nextPage: doc.nextPage,
    page: doc.page,
    hasPrevPage: doc.hasPrevPage,
    hasNextPage: doc.hasNextPage,
    prevLink: doc.hasPrevPage == true ? urlPrev : null,
    nextLink: doc.hasNextPage == true ? urlNext : null,
  };
  return result;
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

class ProductControllero {
  async getProducts(req, res) {
    try {
      const pathUrl = getPathUrl(req);
      const params = getQueryParams(req);
      const productsList = await ProductServicesManager.getProducts(params);
      const urlPrev = getUrl(params, pathUrl, -1);
      const urlNext = getUrl(params, pathUrl, +1);
      const result = createResult(productsList, 'success', urlPrev, urlNext);
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      const result = createResult(productsList, 'error', urlPrev, urlNext);
      return res.status(500).send(result);
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
      return error;
    }
  }

  async getProductById(req, res) {
    try {
      const params = getParams(req);
      const query = {};
      query['_id'] = params.PId;
      const productId = await ProductServicesManager.findProduct(query);
      if (productId == null) {
        return res
          .status(404)
          .json({ status: 'error', error: 'product not found' });
      }
      return res.status(200).json({ status: 'success', payload: productId });
    } catch (error) {
      console.log('error en getproductById' + error);
    }
  }

  async updateById(req, res) {
    try {
      const params = getParams(req);
      const body = req.body;
      const query = {};
      query['_id'] = params.PId;
      const productToUpdate = await ProductServicesManager.findProduct(query);
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
      await ProductServicesManager.findByIdAndUpdate(
        params.PId,
        updatedProduct,
      );
      const result = await ProductServicesManager.findProduct(query);
      return res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = ProductControllero;
