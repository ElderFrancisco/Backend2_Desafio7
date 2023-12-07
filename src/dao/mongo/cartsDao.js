const cartModel = require('./models/carts.model');
class CartsDao {
  async createOne(cart) {
    try {
      return await cartModel.create(cart);
    } catch (error) {
      console.log('error on CartsDao getAll');
    }
  }
}
module.exports = CartsDao;
