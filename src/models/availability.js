const { model, Schema } = require('mongoose');

module.exports = model(
  'Availability',
  new Schema({
    date: { required: true, type: Date },
  }),
);
