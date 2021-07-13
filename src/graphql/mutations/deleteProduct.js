const Product = require('../../models/product');

const deleteProduct = async (_, { deleteProductData: { productId } }, { user }) => {
  const removeResult = await Product.findOneAndRemove({ _id: productId });

  return Boolean(removeResult);
};

module.exports = { deleteProduct };
