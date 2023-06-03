/* eslint-disable max-classes-per-file */
const common = require('../utils/common');

class HttpError extends Error {
  constructor({ message, code }) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
  }
}

class DbError extends Error {
  constructor({ message, code }) {
    super(message);
    this.name = 'DbError';
    this.code = code;
  }
}

class CustomError extends Error {
  constructor({ message, code, data = [] }) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    if (common.isNotEmpty(data)) {
      this.data = data;
    }
  }
}

module.exports = {
  HttpError,
  DbError,
  CustomError,
};
