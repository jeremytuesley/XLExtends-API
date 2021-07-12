class CustomError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500, data = {}) {
    super();
    this.message = message;
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

class BadUserInputError extends CustomError {
  constructor(errorData) {
    super('There were validation errors.', 'BAD_USER_INPUT', '400', errorData);
  }
}

module.exports = { BadUserInputError, CustomError };
