const validator = require('validator');

const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Booking = require('../../models/booking');

const editBooking = async (
  _,
  { editBookingData: { bookingId, duration, serviceId, startTime } },
  { user },
) => {
  if (!user) throw new UnauthorizedOperation();

  const errors = [];

  if (duration === 0 || validator.isEmpty(duration.toString()))
    errors.push('Booking duration is required.');

  if (validator.isEmpty(serviceId)) errors.push('Service id is required.');

  if (validator.isEmpty(startTime.toString())) errors.push('Start time is required.');

  if (errors.length > 0) throw new BadUserInputError(errors);

  const updateResult = await Booking.findOneAndUpdate(
    { _id: bookingId },
    {
      duration,
      serviceId,
      startTime,
    },
    { new: true },
  ).populate({
    path: 'serviceId',
    select: '_id available description duration images name options price salePrice',
    populate: { path: 'creatorId lastEditorId', select: 'email' },
  });

  if (!updateResult) throw new BadUserInputError({ message: 'Invalid booking id' });

  return updateResult;
};

module.exports = { editBooking };
