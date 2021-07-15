const { gql } = require('apollo-server-express');

const typeDefs = gql`
  input CONTACT_DATA {
    comments: String!
    contact: String!
    name: String!
  }

  input CREATE_NEW_ADMIN_DATA {
    email: String!
    password: String!
  }

  input CREATE_NEW_PRODUCT_DATA {
    available: Boolean!
    description: String!
    images: [String!]!
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float
  }

  input DELETE_PRODUCT_DATA {
    productId: ID!
  }

  input EDIT_PRODUCT_DATA {
    available: Boolean!
    description: String!
    images: [String!]!
    name: String!
    options: [String!]!
    price: Float!
    productId: ID!
    salePrice: Float
  }

  input GET_PRODUCT_DATA {
    productId: ID!
  }

  input LOGIN_DATA {
    email: String!
    password: String!
  }

  type AuthToken {
    authToken: String!
  }

  type Admin {
    email: String!
  }

  type Product {
    available: Boolean!
    creatorId: Admin!
    description: String!
    _id: ID!
    images: [String!]!
    lastEditorId: Admin
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float
  }

  type Mutation {
    contact(contactData: CONTACT_DATA): Boolean!
    createNewAdmin(createNewAdminData: CREATE_NEW_ADMIN_DATA): AuthToken!
    createNewProduct(createNewProductData: CREATE_NEW_PRODUCT_DATA): Product!
    deleteProduct(deleteProductData: DELETE_PRODUCT_DATA): Boolean!
    editProduct(editProductData: EDIT_PRODUCT_DATA): Product!
  }

  type Query {
    getAllProducts: [Product!]!
    getProduct(getProductData: GET_PRODUCT_DATA): Product!
    login(loginData: LOGIN_DATA): AuthToken!
  }
`;

module.exports = { typeDefs };
