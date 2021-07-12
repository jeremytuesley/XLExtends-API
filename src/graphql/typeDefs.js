const { gql } = require('apollo-server-express');

const typeDefs = gql`
  input CREATE_NEW_ADMIN_DATA {
    email: String!
    password: String!
  }

  input LOGIN_DATA {
    email: String!
    password: String!
  }

  type AuthToken {
    authToken: String!
  }

  type Product {
    available: Boolean!
    description: String!
    _id: ID!
    images: [String!]!
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float!
  }

  type Mutation {
    createNewAdmin(createNewAdminData: CREATE_NEW_ADMIN_DATA): AuthToken!
  }

  type Query {
    getAllProducts: [Product!]!
    login(loginData: LOGIN_DATA): AuthToken!
  }
`;

module.exports = { typeDefs };
