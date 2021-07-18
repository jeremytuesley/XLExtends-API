const { checkAvailability } = require('./checkAvailability');

const { getAllProducts } = require('./getAllProducts');
const { getAllServices } = require('./getAllServices');

const { getProduct } = require('./getProduct');
const { getService } = require('./getService');

const { login } = require('./login');

const { signRequest } = require('./signRequest');

const { paymentIntent } = require('./paymentIntent');

module.exports = {
  checkAvailability,

  getAllProducts,
  getAllServices,

  getProduct,
  getService,

  login,

  signRequest,

  paymentIntent,
};
