const Product = require('../../models/product');

const getAllProducts = async () => {
  const allProducts = await Product.find();

  return allProducts;
};

module.exports = { getAllProducts };
