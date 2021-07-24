const { model, Schema } = require('mongoose');

module.exports = model(
  'Purchase',
  new Schema(
    {
      comments: { required: false, type: String },
      customer: {
        email: { match: /.+\@.+\..+/, required: true, type: String },
        firstName: { required: true, type: String },
        lastName: { required: true, type: String },
        phoneNumber: { required: true, type: String },
      },
      options: { required: false, type: String },
      paymentId: { required: true, type: String },
      productId: [
        {
          product: { required: false, ref: 'Product', type: Schema.Types.ObjectId },
          quantity: { default: 1, required: true, type: Number },
        },
      ],
      serviceId: { required: false, ref: 'Service', type: Schema.Types.ObjectId },
      shippingAddress: {
        streetName: { required: this.productId, type: String },
        number: { required: this.productId, type: Number },
        suburb: { required: this.productId, type: String },
        postcode: { required: this.productId, type: Number },
        state: { required: this.productId, type: String },
      },
    },
    { sparse: true, timestamps: true },
  ),
);
