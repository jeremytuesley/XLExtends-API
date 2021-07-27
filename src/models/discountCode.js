const { model, Schema } = require('mongoose');

module.exports = model(
  'DiscountCode',
  new Schema({
    name: { required: true, type: String },
    amount: { required: true, type: Number },
  }),
);
