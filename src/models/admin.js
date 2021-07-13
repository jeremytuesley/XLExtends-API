const { model, Schema } = require('mongoose');

module.exports = model(
  'Admin',
  new Schema(
    {
      email: { match: /.+\@.+\..+/, required: true, type: String, unique: true },
      password: { required: true, type: String },
    },
    { timestamps: true },
  ),
);
