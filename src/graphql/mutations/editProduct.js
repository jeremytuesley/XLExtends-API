const validator = require('validator');

const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Product = require('../../models/product');

const editProduct = async (
  _,
  {
    editProductData: { available, description, images, name, options, price, productId, salePrice },
  },
  { user },
) => {
  if (!user) throw new UnauthorizedOperation();

  const errors = [];

  if (validator.isEmpty(description)) errors.push({ message: 'Product description is required.' });

  if (validator.isEmpty(name)) errors.push({ message: 'Product name is required.' });

  if (errors.length) throw new BadUserInputError(errors);

  return await Product.findOneAndUpdate(
    { _id: productId },
    { available, description, images, lastEditorId: user._id, name, options, price, salePrice },
    { new: true },
  )
    .populate('creatorId', 'email')
    .populate('lastEditorId', 'email');
};

module.exports = { editProduct };
