const { BadUserInputError, UnauthorizedOperation } = require('../../errors/CustomErrors');
const Booking = require('../../models/booking');

const deleteBooking = async (_, { deleteBookingData: { bookingId } }, { user }) => {
  if (!user) throw new UnauthorizedOperation();

  const deleteResult = await Booking.findOneAndRemove({ _id: bookingId });

  if (!deleteResult) throw new BadUserInputError({ message: 'Invalid booking id.' });

  return Boolean(deleteResult);
};

module.exports = { deleteBooking };
