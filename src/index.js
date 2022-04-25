require('dotenv').config();
const {
  createDatabaseConnection,
} = require('./database/createDatabaseConnection');
const { initializeServer } = require('./server');

const PORT = process.env.PORT || 5000;

const initializeExpress = async () => {
  const { app, server } = await initializeServer();

  await new Promise((resolve) => app.listen({ port: PORT }, resolve));

  console.log(`Express listening on port ${PORT}...`);
  console.log(`Graphql listening on port ${PORT}${server.graphqlPath}...`);
};

const establishDatabaseConnection = async () =>
  await createDatabaseConnection();

const initializeApp = async () => {
  await establishDatabaseConnection();
  await initializeExpress();
};

initializeApp();
