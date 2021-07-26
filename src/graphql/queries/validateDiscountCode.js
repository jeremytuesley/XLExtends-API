const validator = require('validator');

const { BadUserInputError } = require('../../errors/CustomErrors');
const DiscountCode = require('../../models/discountCode');

const validateDiscountCode = async (_, { discountCode }) => {
  if (validator.isEmpty(discountCode))
    throw new BadUserInputError({ message: 'Discount code is required.' });

  const targetDiscountCode = await DiscountCode.findOne({ name: discountCode });

  if (!targetDiscountCode) throw new BadUserInputError({ message: 'Invalid discount code.' });

  return { isValid: true, discountPercentage: targetDiscountCode.amount };
};

module.exports = { validateDiscountCode };
