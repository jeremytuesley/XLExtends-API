const validator = require('validator');

const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Service = require('../../models/service');

const editService = async (
  _,
  {
    editServiceData: {
      available,
      description,
      duration,
      images,
      name,
      options,
      price,
      salePrice,
      serviceId,
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

  return await Service.findOneAndUpdate(
    { _id: serviceId },
    {
      available,
      description,
      duration,
      images,
      lastEditorId: user._id,
      name,
      options,
      price,
      salePrice,
    },
    { new: true },
  )
    .populate('creatorId', 'email')
    .populate('lastEditorId', 'email');
};

module.exports = { editService };
