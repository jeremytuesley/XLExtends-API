const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Image {
    url: String!
  }

  type Option {
    optionName: String!
    optionValue: String!
  }

  type Product {
    available: Boolean!
    description: String!
    _id: ID!
    images: [Image!]!
    name: String!
    options: [Option]
    price: Float!
    salePrice: Float!
  }

  type Query {
    products: [Product]
  }
`;

module.exports = { typeDefs };
