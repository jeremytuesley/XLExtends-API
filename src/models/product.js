const { model, Schema } = require('mongoose');

module.exports = model(
  'Product',
  new Schema(
    {
      available: { required: true, type: Boolean },
      creatorId: { required: true, ref: 'Admin', type: Schema.Types.ObjectId },
      description: { required: false, type: String },
      images: [{ required: false, type: String }],
      lastEditorId: {
        required: false,
        ref: 'Admin',
        type: Schema.Types.ObjectId,
      },
      name: { require: true, type: String, unique: true },
      options: [{ required: false, type: String }],
      price: { required: true, type: Number },
      salePrice: { required: false, type: Number },
    },
    { timestamps: true }
  )
);
