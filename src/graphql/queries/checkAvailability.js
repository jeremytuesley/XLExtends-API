const { DateTime } = require('luxon');

const Booking = require('../../models/booking');

const checkAvailability = (_, { checkAvailabilityData: { quantity, timeUnit } }) => {
  const now = DateTime.now();

  const endAvailabilityDate = now.plus({ [timeUnit]: quantity });

  const booked = Booking.find({
    startTime: { $lte: endAvailabilityDate.toISODate() },
  }).populate('serviceId', 'available');

  return booked;
};

module.exports = { checkAvailability };
