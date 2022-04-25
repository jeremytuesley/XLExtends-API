const mongoose = require('mongoose');

const createDatabaseConnection = async () => {
  console.log('Connecting to the database...');

  await mongoose.connect(
    `mongodb+srv://${process.env.DB_ATLAS_USERNAME}:${process.env.DB_ATLAS_PASSWORD}@cluster0.6hzv6.mongodb.net/XLExtends?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );

  console.log('Database connection established successfully!');
};

module.exports = { createDatabaseConnection };
