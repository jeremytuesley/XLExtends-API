const { model, Schema } = require('mongoose');

module.exports = model(
  'Booking',
  new Schema(
    {
      comments: { required: false, type: String },
      customer: {
        email: { match: /.+\@.+\..+/, required: true, type: String },
        firstName: { required: true, type: String },
        lastName: { required: true, type: String },
        phoneNumber: { required: true, type: String },
      },
      duration: { required: true, type: Number },
      paymentId: { required: true, type: String },
      serviceId: { required: true, ref: 'Service', type: Schema.Types.ObjectId },
      startTime: { required: true, type: Date },
    },
    { sparse: true, timestamps: true },
  ),
);
