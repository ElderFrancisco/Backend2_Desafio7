const cartModel = require('./models/carts.model');
class CartsDao {
  async createOne(cart) {
    try {
      return await cartModel.create(cart);
    } catch (error) {
      console.log('error on CartsDao createOne' + error);
    }
  }
  async getOne(query) {
    try {
      return await cartModel.findOne(query).populate('products.product').lean();
    } catch (error) {
      console.log('error on CartsDao getOne' + error);
    }
  }
  async getAll(params) {
    try {
      return await cartModel.paginate(
        {},
        {
          limit: params.limit,
          page: params.page,
          lean: true,
        },
      );
    } catch (error) {
      console.log('error on CartsDao getAll' + error);
    }
  }

  async updateOne(query, update) {
    try {
      return await cartModel.findOneAndUpdate(query, update, { new: true });
    } catch (error) {
      console.log('error on CartsDao getOne' + error);
      return;
    }
  }
}
module.exports = CartsDao;
