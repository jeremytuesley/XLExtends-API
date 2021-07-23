const { ObjectId } = require('mongoose').Types;
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const { BadUserInputError } = require('../../errors/CustomErrors');
const DiscountCode = require('../../models/discountCode');
const Product = require('../../models/product');
const Service = require('../../models/service');

const SHIPPING_FLAT_FEE = 1500;

const paymentIntent = async (
  _,
  { paymentIntentData: { productId, serviceId, discount, shipping } },
) => {
  let productsTotal;
  let servicesTotal;
  let targetDiscountCode;

  if (productId) {
    const requestedProducts = await Product.find({
      _id: { $in: productId.map(({ id }) => ObjectId(id)) },
    });

    productsTotal = requestedProducts.reduce(
      (total, product) =>
        total +
        (product.salePrice || product.price) *
          productId.find((p) => p.id === product._id.toString()).quantity,
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

  let total = parseFloat(productsTotal || servicesTotal).toFixed(2) * 100;

  if (discount) {
    targetDiscountCode = await DiscountCode.findOne({ name: discount });
    if (targetDiscountCode)
      total = (total * parseFloat((100 - targetDiscountCode.amount) / 100).toFixed(2)).toFixed(0);
    else throw new BadUserInputError({ message: 'Invalid discount code.' });
  }

  if (shipping) {
    total = parseInt(total) + SHIPPING_FLAT_FEE;
  }
  const intent = await stripe.paymentIntents.create({ amount: total, currency: 'aud' });

  console.log(total);

  return { clientSecret: intent.client_secret };
};

module.exports = { paymentIntent };
