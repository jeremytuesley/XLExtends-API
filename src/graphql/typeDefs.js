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

    checkAvailability(checkAvailabilityData: CHECK_AVAILABILITY_DATA): [String]!

    paymentIntent(paymentIntentData: PAYMENT_INTENT_DATA): ClientSecret!
  }

  input CREATE_NEW_ADMIN_DATA {
    email: String!
    password: String!
  }
`;

module.exports = { typeDefs };
