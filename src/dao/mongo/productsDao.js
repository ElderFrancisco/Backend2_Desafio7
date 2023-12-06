const productModel = require('./models/products.model');
class ProductsDao {
  async getAll(params) {
    try {
      return await productModel.paginate(params.query, {
        limit: params.limit,
        page: params.page,
        sort: params.sort,
        lean: true,
      });
    } catch (error) {
      console.log('error on dao getAll');
    }
  }
  async createOne(product) {
    try {
      return await productModel.create(product);
    } catch (error) {
      console.log('error on dao createOne');
    }
  }
  async get(query) {
    try {
      return await productModel.findOne(query).lean();
    } catch (error) {
      console.log('error on dao getById');
    }
  }

  async updateOne(query, update) {
    try {
      return await productModel
        .findOneAndUpdate(query, update, { new: true })
        .lean();
    } catch (error) {
      console.log('error on dao updateOne');
    }
  }
  async deleteOne(query) {
    try {
      return await productModel.deleteOne(query);
    } catch (error) {
      console.log('error on dao updateOne');
    }
  }
}
module.exports = ProductsDao;
