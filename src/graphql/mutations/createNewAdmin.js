const bcrypt = require('bcrypt');
const validator = require('validator');

const { BadUserInputError } = require('../../errors/CustomErrors');
const Admin = require('../../models/admin');
const { signToken } = require('../../utils/authToken');

const createNewAdmin = async (_, { createNewAdminData: { email, password } }) => {
  const errors = [];

  if (validator.isEmpty(email)) errors.push({ message: 'Email required.' });

  if (!validator.isEmail(email)) errors.push({ message: 'Invalid email address.' });

  if (validator.isEmpty(password)) errors.push({ message: 'Password required.' });

  if (!validator.isLength(password, { min: 6 }))
    errors.push({ message: 'Password too short (min. 6 characters).' });

  if (errors.length > 0) throw new BadUserInputError(errors);

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) throw new BadUserInputError({ message: 'Email already taken.' });

  const hashedPassword = await bcrypt.hash(password, 12);

  const newAdmin = new Admin({ email, password: hashedPassword });

  const newAdminSaveResponse = await newAdmin.save();

  return {
    authToken: signToken({ email: newAdminSaveResponse.email, _id: newAdminSaveResponse._id }),
  };
};

module.exports = { createNewAdmin };
