const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Service = require('../../models/service');

const deleteService = async (_, { deleteServiceData: { serviceId } }, { user }) => {
  if (!user) throw new UnauthorizedOperation();

  const removeResult = await Service.findOneAndRemove({ _id: serviceId });

  if (!removeResult)
    throw new BadUserInputError({ message: 'Invalid service id. Nothing removed!' });

  return Boolean(removeResult);
};

module.exports = { deleteService };
