const validator = require('validator');

const { BadUserInputError } = require('../../errors/CustomErrors');
const Booking = require('../../models/booking');
const Service = require('../../models/service');

const { sendEmail } = require('../../utils/email');

const createNewBooking = async (
  _,
  {
    createNewBookingData: {
      comments,
      customer: { email, firstName, lastName, phoneNumber },
      duration,
      paymentId,
      serviceId,
      startTime,
    },
  },
) => {
  const errors = [];

  if (duration === 0 || validator.isEmpty(duration.toString()))
    errors.push('Booking duration is required.');

  if (validator.isEmpty(paymentId)) errors.push('Payment id is required.');

  if (validator.isEmpty(serviceId)) errors.push('Service id is required.');

  if (validator.isEmpty(startTime.toString())) errors.push('Start time is required.');

  if (errors.length > 0) throw new BadUserInputError(errors);

  const targetService = await Service.findOne({ _id: serviceId })
    .populate('creatorId', 'email')
    .populate('lastEditorId', 'email');

  if (!targetService) throw new BadUserInputError({ message: 'Invalid service id.' });

  const newBooking = new Booking({
    comments,
    customer: { email, firstName, lastName, phoneNumber },
    duration,
    paymentId,
    serviceId,
    startTime,
  });

  const newBookingSaveResponse = await newBooking.save();

  sendEmail(newBookingSaveResponse.customer.email, 'Thank you for making the booking.', 'THANKS');

  return {
    ...newBookingSaveResponse._doc,
    serviceId: targetService._doc,
  };
};

module.exports = { createNewBooking };
