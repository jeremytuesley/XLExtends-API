const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Product = require('../../models/product');

const deleteProduct = async (_, { deleteProductData: { productId } }, { user }) => {
  if (!user) throw new UnauthorizedOperation();

  const removeResult = await Product.findOneAndRemove({ _id: productId });

  if (!removeResult)
    throw new BadUserInputError({ message: 'Invalid product id. Nothing removed!' });

  return Boolean(removeResult);
};

module.exports = { deleteProduct };
