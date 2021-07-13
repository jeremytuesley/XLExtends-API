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

  const targetProduct = await Product.findOne({ _id: productId }).populate('creatorId', 'email');

  targetProduct.available = available;
  targetProduct.description = description;
  targetProduct.images = images;
  targetProduct.lastEditorId = user._id;
  targetProduct.name = name;
  targetProduct.options = options;
  targetProduct.price = price;
  targetProduct.salePrice = salePrice;

  const targetProductSaveResult = await targetProduct.save();

  return {
    ...targetProductSaveResult._doc,
    lastEditorId: { email: user.email },
  };
};

module.exports = { editProduct };
