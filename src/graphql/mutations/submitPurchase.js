const { ObjectId } = require('mongoose').Types;

const { BadUserInputError } = require('../../errors/CustomErrors');
const Product = require('../../models/product');
const Purchase = require('../../models/purchase');
const Service = require('../../models/service');

const { sendEmail } = require('../../utils/email');

const submitPurchase = async (
  _,
  {
    submitPurchaseData: {
      comments,
      customer,
      options,
      paymentId,
      productId,
      serviceId,
      shippingAddress,
    },
  },
) => {
  const errors = [];

  if (!customer) errors.push({ message: 'Customer data is required.' });
  if (!paymentId) errors.push({ message: 'Payment id is required.' });
  if (!productId && !serviceId) errors.push({ message: 'Either product or service is required.' });

  if (errors.length > 0) throw new BadUserInputError({ errors });

  let targetProducts;
  let targetService;

  if (productId) {
    targetProducts = await Product.find({
      _id: { $in: productId.map((product) => ObjectId(product.id)) },
    }).populate({ path: 'creatorId lastEditorId', select: 'email' });
  }

  if (serviceId) {
    targetService = await Service.findOne({ _id: serviceId }).populate({
      path: 'creatorId lastEditorId',
      select: 'email',
    });
  }
  const newPurchase = new Purchase({
    comments,
    customer,
    options,
    paymentId,
    ...(productId && {
      productId: [...productId.map((product) => ({ ...product, product: ObjectId(product.id) }))],
    }),
    ...(serviceId && { serviceId }),
    shippingAddress,
  });

  const newPurchaseSaveResponse = await newPurchase.save();

  sendEmail(newPurchaseSaveResponse.customer.email, 'Thank you for the purchase.', 'THANKS');

  if (productId) {
    return { ...newPurchaseSaveResponse._doc, productId: targetProducts };
  } else if (serviceId) {
    return { ...newPurchaseSaveResponse._doc, serviceId: { ...targetService._doc } };
  }
};

module.exports = { submitPurchase };
