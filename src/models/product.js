const { model, Schema } = require('mongoose');

module.exports = model(
  'Product',
  new Schema({
    available: { required: true, type: Boolean },
    description: { required: false, type: String },
    images: [{ required: false, type: String }],
    name: { require: true, type: String, unique: true },
    price: { required: true, type: Number },
    salePrice: { required: true, type: Number },
  }),
);
