const validator = require('validator');

const { UnauthorizedOperation, BadUserInputError } = require('../../errors/CustomErrors');
const Product = require('../../models/product');

const createNewProduct = async (
  _,
  { createNewProductData: { available, description, images, name, options, price, salePrice } },
  { user },
) => {
  if (!user) throw new UnauthorizedOperation();

  const errors = [];

  if (validator.isEmpty(description)) errors.push({ message: 'Product description is required.' });

  if (validator.isEmpty(name)) errors.push({ message: 'Product name is required.' });

  if (errors.length) throw new BadUserInputError(errors);

  const existingProduct = await Product.findOne({ name });

  if (existingProduct)
    throw new BadUserInputError({ message: `Product with name - ${name} - already exists.` });

  const newProduct = new Product({
    available,
    creatorId: user._id,
    description,
    images,
    name,
    options,
    price,
    salePrice,
  });

  const newProductSaveResult = await newProduct.save();

  return { ...newProductSaveResult._doc, creatorId: { email: user.email } };
};

module.exports = { createNewProduct };
