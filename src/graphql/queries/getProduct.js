const validator = require('validator');

const { BadUserInputError } = require('../../errors/CustomErrors');
const Product = require('../../models/product');

const getProduct = async (_, { getProductData: { productId } }) => {
  if (validator.isEmpty(productId))
    throw new BadUserInputError({ message: 'Product ID is required.' });

  const targetProduct = await Product.findOne({ _id: productId })
    .populate('creatorId', 'email')
    .populate('lastEditorId', 'email');

  if (!targetProduct) throw new BadUserInputError({ message: 'Invalid product ID.' });

  const { cratedAt, updatedAt, ...restTargetProduct } = targetProduct._doc;
  return restTargetProduct;
};

module.exports = { getProduct };
