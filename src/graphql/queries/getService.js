const validator = require('validator');

const { BadUserInputError } = require('../../errors/CustomErrors');
const Service = require('../../models/service');

const getService = async (_, { getServiceData: { serviceId } }) => {
  if (validator.isEmpty(serviceId))
    throw new BadUserInputError({ message: 'Service id is require.' });

  const targetService = await Service.findOne({ _id: serviceId })
    .populate('creatorId', 'email')
    .populate('lastEditorId', 'email');

  if (!targetService) throw new BadUserInputError({ message: 'Invalid service id.' });

  return targetService;
};

module.exports = { getService };
