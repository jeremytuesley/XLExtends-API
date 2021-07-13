const Product = require('../../models/product');

const getAllProducts = async () => {
  const allProducts = await Product.find()
    .populate('creatorId', 'email')
    .populate('lastEditorId', 'email');

  return allProducts;
};

module.exports = { getAllProducts };
