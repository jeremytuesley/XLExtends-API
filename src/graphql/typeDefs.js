const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  input CHECK_AVAILABILITY_DATA {
    quantity: Int!
    timeUnit: String!
  }

  input CONTACT_DATA {
    comments: String
    contact: String!
    files: [Upload!]!
    name: String!
  }

  input CREATE_NEW_ADMIN_DATA {
    email: String!
    password: String!
  }

  input CUSTOMER_INPUT_DATA {
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String!
  }

  input CREATE_NEW_BOOKING_DATA {
    comments: String
    customer: CUSTOMER_INPUT_DATA!
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

  input SUBMIT_PURCHASE_DATA {
    comments: String
    customer: CUSTOMER_INPUT_DATA!
    paymentId: ID!
    productId: [ID]
    serviceId: ID
    shippingAddress: SHIPPING_ADDRESS_DATA
  }

  type Purchase {
    _id: ID!
    comments: String
    customer: CustomerData!
    paymentId: ID!
    productId: [Product]
    serviceId: Service
    shippingAddress: ShippingAddress
  }

  input SHIPPING_ADDRESS_DATA {
    streetName: String!
    number: Int!
    suburb: String!
    postcode: Int!
    state: String!
  }

  type ShippingAddress {
    streetName: String!
    number: Int!
    suburb: String!
    postcode: Int!
    state: String!
  }

  type Admin {
    email: String!
  }

  type AuthToken {
    authToken: String!
  }

  type Booking {
    _id: ID!
    customer: CustomerData!
    comments: String
    duration: Int!
    paymentId: ID!
    serviceId: Service!
    startTime: String!
  }

  type CustomerData {
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String!
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Product {
    _id: ID!
    available: Boolean!
    creatorId: Admin!
    description: String!
    images: [String!]!
    lastEditorId: Admin
    name: String!
    options: [String!]!
    price: Float!
    salePrice: Float
  }

  type Service {
    _id: ID!
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

    submitPurchase(submitPurchaseData: SUBMIT_PURCHASE_DATA): Purchase!
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
