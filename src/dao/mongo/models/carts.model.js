const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

cartsSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartModel;
