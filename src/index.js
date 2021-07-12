const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');

const { createDatabaseConnection } = require('./database/createDatabaseConnection');
const resolvers = require('./graphql/resolvers');
const { typeDefs } = require('./graphql/typeDefs');

const PORT = process.env.PORT || 5000;

const initializeExpress = async () => {
  const app = express();

  const server = new ApolloServer({
    context: ({ req }) => req,
    resolvers,
    typeDefs,
  });

  await server.start();

  // TODO: Put right origin.
  app.use(cors());
  app.use(express.json());

  server.applyMiddleware({ app, path: '/v1/graphql' });

  await new Promise((resolve) => app.listen({ port: PORT }, resolve));

  console.log(`Express listening on port ${PORT}...`);
  console.log(`Graphql listening on port ${PORT}${server.graphqlPath}...`);
};

const establishDatabaseConnection = async () => await createDatabaseConnection();

const initializeApp = async () => {
  await establishDatabaseConnection();
  await initializeExpress();
};

initializeApp();
