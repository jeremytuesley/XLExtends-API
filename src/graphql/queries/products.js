const Product = require('../../models/product');

const products = async () => {
  const allProducts = await Product.find();

  // return [
  //   {
  //     available: true,
  //     description: 'yes',
  //     _id: '1',
  //     images: [],
  //     options: [
  //       { optionName: 'BACKGROUND_COLOR', optionValue: 'red' },
  //       { optionName: 'TEXT_COLOR', optionValue: 'blue' },
  //     ],
  //     name: 'Also yes',
  //     price: 3.5,
  //     salePrice: 5,
  //   },
  // ];

  return allProducts;
};

module.exports = { products };
