const { DateTime } = require('luxon');

const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Availability = require('../../models/availability');

const setAvailability = async (_, { setAvailabilityData: { date } }, { user }) => {
  if (!user) throw new UnauthorizedOperation();

  if (!date) throw new BadUserInputError({ message: 'Unavailability date is required.' });

  const newAvailability = new Availability({
    date,
  });

  const newAvailabilitySaveResponse = await newAvailability.save();

  return new DateTime(newAvailabilitySaveResponse.date).toISODate();
};

module.exports = { setAvailability };
