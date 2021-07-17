const { model, Schema } = require('mongoose');

module.exports = model(
  'Booking',
  new Schema(
    {
      duration: { required: true, type: Number },
      paymentId: { required: true, type: String },
      serviceId: { required: true, ref: 'Service', type: Schema.Types.ObjectId },
      startTime: { required: true, type: Date },
    },
    { timestamps: true },
  ),
);
