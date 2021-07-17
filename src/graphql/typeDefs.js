const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  input CHECK_AVAILABILITY_DATA {
    quantity: Int!
    timeUnit: String!
  }

  input CONTACT_DATA {
    comments: String!
    contact: String!
    files: [Upload!]!
    name: String!
  }

  input CREATE_NEW_ADMIN_DATA {
    email: String!
    password: String!
  }

  input CREATE_NEW_BOOKING_DATA {
    duration: Int!
    paymentId: ID!
    serviceId: ID!
    startTime: String!
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

  input CREATE_NEW_SERVICE_DATA {
    available: Boolean!
    description: String!
    duration: Int!
    images: [String!]!
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float
  }

  input DELETE_BOOKING_DATA {
    bookingId: ID!
  }

  input DELETE_PRODUCT_DATA {
    productId: ID!
  }

  input DELETE_SERVICE_DATA {
    serviceId: ID!
  }

  input EDIT_BOOKING_DATA {
    bookingId: ID!
    duration: Int!
    serviceId: ID!
    startTime: String!
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

  input EDIT_SERVICE_DATA {
    available: Boolean!
    description: String!
    duration: Int!
    images: [String!]!
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float
    serviceId: ID!
  }

  input GET_PRODUCT_DATA {
    productId: ID!
  }

  input GET_SERVICE_DATA {
    serviceId: ID!
  }

  input LOGIN_DATA {
    email: String!
    password: String!
  }

  type Admin {
    email: String!
  }

  type AuthToken {
    authToken: String!
  }

  type Booking {
    duration: Int!
    paymentId: ID!
    serviceId: Service!
    startTime: String!
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
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

  type Service {
    available: Boolean!
    creatorId: Admin!
    description: String!
    duration: Int!
    images: [String!]!
    lastEditorId: Admin
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float
  }

  type SignatureData {
    signature: String!
    timestamp: Int!
  }

  type Mutation {
    contact(contactData: CONTACT_DATA): Boolean!

    createNewAdmin(createNewAdminData: CREATE_NEW_ADMIN_DATA): AuthToken!
    createNewBooking(createNewBookingData: CREATE_NEW_BOOKING_DATA): Booking!
    createNewProduct(createNewProductData: CREATE_NEW_PRODUCT_DATA): Product!
    createNewService(createNewServiceData: CREATE_NEW_SERVICE_DATA): Service!

    deleteBooking(deleteBookingData: DELETE_BOOKING_DATA): Boolean!
    deleteProduct(deleteProductData: DELETE_PRODUCT_DATA): Boolean!
    deleteService(deleteServiceData: DELETE_SERVICE_DATA): Boolean!

    editBooking(editBookingData: EDIT_BOOKING_DATA): Booking!
    editProduct(editProductData: EDIT_PRODUCT_DATA): Product!
    editService(editServiceData: EDIT_SERVICE_DATA): Service!
  }

  type Query {
    checkAvailability(checkAvailabilityData: CHECK_AVAILABILITY_DATA): [Booking!]!

    getAllProducts: [Product!]!
    getAllServices: [Service!]!

    getProduct(getProductData: GET_PRODUCT_DATA): Product!
    getService(getServiceData: GET_SERVICE_DATA): Service!

    login(loginData: LOGIN_DATA): AuthToken!
    signRequest: SignatureData!
  }
`;

module.exports = { typeDefs };
