const CartsDao = require('../dao/mongo/cartsDao');

const CartsDaoManager = new CartsDao();

class CartServices {
  async createNewCart(cart) {
    try {
      return await CartsDaoManager.createOne(cart);
    } catch (error) {
      console.log('Error on CartServices, createNewCart function: ' + error);
      return error;
    }
  }
}
module.exports = CartServices;
