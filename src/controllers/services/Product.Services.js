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
      return await productModel.create(product);
    } catch (error) {
      console.log('Error on ProductServices, createProduct function: ' + error);
    }
  }
  async findProduct(query) {
    try {
      return await productModel.findOne(query).lean();
    } catch (error) {
      console.log('Error on ProductServices, findProduct function: ' + error);
    }
  }

  async findByIdAndUpdate(id, body) {
    try {
      return await productModel.findByIdAndUpdate(id, body).lean();
    } catch (error) {
      console.log(
        'Error on ProductServices, findByIdAndUpdate function: ' + error,
      );
    }
  }
}

module.exports = ProductServices;
