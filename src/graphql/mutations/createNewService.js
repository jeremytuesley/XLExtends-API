const validator = require('validator');

const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Service = require('../../models/service');

const createNewService = async (
  _,
  {
    createNewServiceData: {
      available,
      description,
      duration,
      images,
      name,
      options,
      price,
      salePrice,
    },
  },
  { user },
) => {
  if (!user) throw new UnauthorizedOperation();

  const errors = [];

  if (validator.isEmpty(description)) errors.push({ message: 'Service description is required.' });

  if (!duration) errors.push({ message: 'Service duration is required.' });

  if (validator.isEmpty(name)) errors.push({ message: 'Service name is required.' });

  if (!price) errors.push({ message: 'Service price is required.' });

  if (errors.length) throw new BadUserInputError(errors);

  const existingService = await Service.findOne({ name });

  if (existingService)
    throw new BadUserInputError({ message: `Service with name - ${name} - already exists.` });

  const newService = new Service({
    available,
    creatorId: user._id,
    description,
    duration,
    images,
    name,
    options,
    price,
    salePrice,
  });

  const newServiceSaveResponse = await newService.save();

  return { ...newServiceSaveResponse._doc, creatorId: { email: user.email } };
};

module.exports = { createNewService };
