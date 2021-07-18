const Product = require('../../models/product');
const Purchase = require('../../models/purchase');
const Service = require('../../models/service');

const submitPurchase = async (
  _,
  { submitPurchaseData: { comments, customer, paymentId, productId, serviceId, shippingAddress } },
) => {
  let targetProduct;
  let targetService;

  if (productId) {
    targetProduct = await Product.findOne({ _id: productId }).populate({
      path: 'creatorId lastEditorId',
      select: 'email',
    });
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
    paymentId,
    ...(productId && { productId }),
    ...(serviceId && { serviceId }),
    shippingAddress,
  });

  const newPurchaseSaveResponse = await newPurchase.save();

  if (productId) {
    return { ...newPurchaseSaveResponse._doc, productId: { ...targetProduct._doc } };
  } else if (serviceId) {
    return { ...newPurchaseSaveResponse._doc, serviceId: { ...targetService._doc } };
  }
};

module.exports = { submitPurchase };
