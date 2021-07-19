const { ObjectId } = require('mongoose').Types;
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const Product = require('../../models/product');
const Service = require('../../models/service');

const paymentIntent = async (
  _,
  { paymentIntentData: { productId, serviceId, discount, shipping } },
) => {
  let productsTotal;
  let servicesTotal;

  if (productId) {
    const requestedProducts = await Product.find({
      _id: { $in: productId.map((id) => ObjectId(id)) },
    });

    productsTotal = requestedProducts.reduce(
      (total, product) => total + (product.salePrice || product.price),
      0,
    );
  }

  if (serviceId) {
    const requestedServices = await Service.find({
      _id: { $in: serviceId.map((id) => ObjectId(id)) },
    });

    servicesTotal = requestedServices.reduce(
      (total, service) => total + (service.salePrice || service.price),
      0,
    );
  }

  let total = parseFloat((productsTotal + servicesTotal).toFixed(2)) * 100;

  if (shipping) {
    total += 1500;
  }

  const intent = await stripe.paymentIntents.create({ amount: total, currency: 'aud' });

  return { clientSecret: intent.client_secret };
};

module.exports = { paymentIntent };
