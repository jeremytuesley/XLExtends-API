const bcrypt = require('bcrypt');
const validator = require('validator');

const { BadUserInputError } = require('../../errors/CustomErrors');
const Admin = require('../../models/admin');
const { signToken } = require('../../utils/authToken');

const login = async (_, { loginData: { email, password } }) => {
  const errors = [];

  if (validator.isEmpty(email)) errors.push({ message: 'Email is required.' });

  if (validator.isEmpty(password))
    errors.push({ message: 'Password is required.' });

  if (errors.length) throw new BadUserInputError(errors);

  const targetAdmin = await Admin.findOne({ email });

  if (!targetAdmin) throw new BadUserInputError();

  const doPasswordsMatch = await bcrypt.compare(password, targetAdmin.password);

  if (!doPasswordsMatch) throw new BadUserInputError();

  return {
    authToken: signToken({ email: targetAdmin.email, _id: targetAdmin._id }),
  };
};

module.exports = { login };
