const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Product = require('../src/models/product');
const Service = require('../src/models/service');

const createTestDatabase = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_ATLAS_USERNAME}:${process.env.DB_ATLAS_PASSWORD}@cluster0.rkloo.mongodb.net/XLExtends-test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  );

  await Promise.all([
    ...Array.from({ length: 5 }, (_, index) => index).map(() =>
      new Product({
        available: true,
        creatorId: '60ed5ef6582869002b875bd8',
        name: `New Product ${uuidv4()}`,
        price: 99,
      }).save(),
    ),
    ...Array.from({ length: 5 }, (_, index) => index).map(() =>
      new Service({
        available: true,
        creatorId: '60ed5ef6582869002b875bd8',
        name: `New Service ${uuidv4()}`,
        price: 99,
      }).save(),
    ),
  ]);
};

module.exports = { createTestDatabase };
