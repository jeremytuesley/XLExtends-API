const { DateTime } = require('luxon');

const Availability = require('../../models/availability');
const Booking = require('../../models/booking');

const checkAvailability = async (_, { checkAvailabilityData: { quantity, timeUnit } }) => {
  const endAvailabilityDateCheck = DateTime.now()
    .plus({ [timeUnit]: quantity })
    .toISODate();

  const [unAvailabilities, bookings] = await Promise.all([
    Availability.find({
      date: {
        $lte: endAvailabilityDateCheck,
      },
    }),
    Booking.find({
      startTime: {
        $lte: endAvailabilityDateCheck,
      },
    }),
  ]);

  return new Set([
    ...bookings.map((booking) =>
      DateTime.fromISO(new Date(booking.startTime).toISOString()).toISODate(),
    ),
    ...unAvailabilities.map((unAvailability) =>
      DateTime.fromISO(new Date(unAvailability.date).toISOString()).toISODate(),
    ),
  ]);
};

module.exports = { checkAvailability };
