const productModel = require('../../dao/models/products.model');

class ProductServices {
  async getProducts(params) {
    try {
      const productList = await productModel.paginate(params.query, {
        limit: params.limit,
        page: params.page,
        sort: params.sort,
        lean: true,
      });
      return productList;
    } catch (error) {
      console.log('Error on ProductServices, getProducts function: ' + error);
    }
  }
  async createProduct(product) {
    try {
      const Product = await productModel.create(product);
      return Product;
    } catch (error) {
      console.log('Error on ProductServices, createProduct function: ' + error);
    }
  }
  async findProduct(key, valor) {
    try {
      const query = {};
      query[key] = valor;
      const product = await productModel.findOne(query).lean();
      return product;
    } catch (error) {
      console.log('Error on ProductServices, findProduct function: ' + error);
    }
  }
}

module.exports = ProductServices;
