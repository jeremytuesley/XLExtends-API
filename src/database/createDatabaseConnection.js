const mongoose = require('mongoose');

const createDatabaseConnection = async () => {
  console.log('Connecting to the database...');

  await mongoose.connect(
    process.env.NODE_ENV === 'dev' ? 'mongodb://mongo:27017/XLExtends' : 'prod address',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  );

  console.log('Database connection established successfully!');
};

module.exports = { createDatabaseConnection };
