const { contact } = require('./contact');

const { createNewAdmin } = require('./createNewAdmin');
const { createNewBooking } = require('./createNewBooking');
const { createNewProduct } = require('./createNewProduct');
const { createNewService } = require('./createNewService');

const { deleteBooking } = require('./deleteBooking');
const { deleteProduct } = require('./deleteProduct');
const { deleteService } = require('./deleteService');

const { editBooking } = require('./editBooking');
const { editProduct } = require('./editProduct');
const { editService } = require('./editService');

const { submitPurchase } = require('./submitPurchase');
const { setAvailability } = require('./setAvailability');

module.exports = {
  contact,

  createNewAdmin,
  createNewBooking,
  createNewProduct,
  createNewService,

  deleteBooking,
  deleteProduct,
  deleteService,

  editBooking,
  editProduct,
  editService,

  submitPurchase,
  setAvailability,
};
