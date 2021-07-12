const { CustomError } = require('../errors/CustomErrors');

const handleErrors = (error) => {
  console.log(error?.originalError || error);
  if (error?.originalError instanceof CustomError) {
    return {
      code: error.originalError.code,
      data: error.originalError.data,
      message: error.originalError.message,
      status: error.originalError.status,
    };
  } else {
    return {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong! Please try again later!',
      status: 500,
    };
  }
};

module.exports = { handleErrors };
