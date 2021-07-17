const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');

const { handleErrors } = require('../errors/handleErrors');
const resolvers = require('../graphql/resolvers');
const { typeDefs } = require('../graphql/typeDefs');
const { authenticateUser } = require('../middleware/authenticateUser');

const initializeServer = async () => {
  const app = express();

  const server = new ApolloServer({
    context: ({ req }) => ({ req, user: authenticateUser(req) }),
    formatError: (error) => handleErrors(error),
    resolvers,
    typeDefs,
    uploads: false,
  });

  await server.start();

  app.use(express.json());
  // // TODO: Put right origin.
  app.use(cors({ origin: 'https://test-front-end-xxx.herokuapp.com' }));
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app, path: '/v1/graphql' });

  return { app, server };
};

module.exports = { initializeServer };
