const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type Mutation {
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

    setAvailability(setAvailabilityData: SET_AVAILABILITY_DATA): String!

    contact(contactData: CONTACT_DATA): Boolean!
  }

  type Query {
    isAuth: Boolean!
    login(loginData: LOGIN_DATA): AuthToken!

    getAllProducts: [Product!]!
    getAllServices: [Service!]!

    getProduct(getProductData: GET_PRODUCT_DATA): Product!
    getService(getServiceData: GET_SERVICE_DATA): Service!

    signRequest: SignatureData!

    checkAvailability(checkAvailabilityData: CHECK_AVAILABILITY_DATA): [String]

    paymentIntent(paymentIntentData: PAYMENT_INTENT_DATA): ClientSecret!
  }

  input CHECK_AVAILABILITY_DATA {
    quantity: Int!
    timeUnit: String!
  }

  input CONTACT_DATA {
    comments: String
    contact: String!
    files: [Upload]
    name: String!
  }

  input CREATE_NEW_ADMIN_DATA {
    email: String!
    password: String!
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
    images: [String]
    name: String!
    options: [String]
    price: Float!
    salePrice: Float
  }

  input CREATE_NEW_SERVICE_DATA {
    available: Boolean!
    description: String!
    duration: Int!
    images: [String]
    name: String!
    options: [String]
    price: Float!
    salePrice: Float
  }

  input CUSTOMER_INPUT_DATA {
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String!
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
    images: [String]
    name: String!
    options: [String]
    price: Float!
    productId: ID!
    salePrice: Float
  }

  input EDIT_SERVICE_DATA {
    available: Boolean!
    description: String!
    duration: Int!
    images: [String]
    name: String!
    options: [String]
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

  input PAYMENT_INTENT_DATA {
    productId: [PRODUCT_ORDER]
    serviceId: [ID]
    discount: String
    shipping: Boolean!
  }

  input PRODUCT_ORDER {
    id: ID!
    options: String
    quantity: Int!
  }

  input SET_AVAILABILITY_DATA {
    date: String!
  }

  input SHIPPING_ADDRESS_DATA {
    comments: String
    streetName: String!
    number: String!
    suburb: String!
    postcode: Int!
    state: String!
  }

  input SUBMIT_PURCHASE_DATA {
    comments: String
    customer: CUSTOMER_INPUT_DATA!
    options: String
    paymentId: ID!
    productId: [PRODUCT_ORDER]
    serviceId: ID
    shippingAddress: SHIPPING_ADDRESS_DATA
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

  type ClientSecret {
    clientSecret: String!
  }

  type CustomerData {
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String!
  }

  type Product {
    _id: ID!
    available: Boolean!
    creatorId: Admin!
    description: String!
    images: [String]
    lastEditorId: Admin
    name: String!
    options: [String]
    price: Float!
    salePrice: Float
  }

  type Purchase {
    _id: ID!
    comments: String
    customer: CustomerData!
    options: String
    paymentId: ID!
    productId: [Product]
    serviceId: Service
    shippingAddress: ShippingAddress
  }

  type Service {
    _id: ID!
    available: Boolean!
    creatorId: Admin!
    description: String!
    duration: Int!
    images: [String]
    lastEditorId: Admin
    name: String!
    options: [String]
    price: Float!
    salePrice: Float
  }

  type ShippingAddress {
    comments: String
    streetName: String!
    number: String!
    suburb: String!
    postcode: Int!
    state: String!
  }

  type SignatureData {
    signature: String!
    timestamp: Int!
  }
`;

module.exports = { typeDefs };
