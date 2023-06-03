/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const { env } = require('../config');
const { ERROR_CODE, STATUS, HTTP_STATUS } = require('../error/error_code');
const { CustomError } = require('../error/error');
const { logger } = require('./logger');

const responseHelper = (res) => {
  const base = (status, data = null) => {
    const { app = '', version = '' } = env;
    const obj = { status, app, version };
    if (data) {
      if (status === STATUS.SUCCESS) {
        if (data instanceof Array) {
          data = { list: data };
        }
        data.code = ERROR_CODE.SUCCESS.code;
      }
      obj.data = data;
    }
    delete obj.status;
    return obj;
  };

  return {

    status: () => res.status(HTTP_STATUS.OK).json(base(STATUS.SUCCESS)),

    success: (data) => res.status(HTTP_STATUS.OK).json(base(STATUS.SUCCESS, data)),

    fail: (error) => {
      if (!(error instanceof Error)) {
        error = new CustomError({ message: 'not error instance', code: ERROR_CODE.UNKNOWN_ERROR });
      }

      logger.error({
        message: error.message,
        stack: error.stack,
      });

      if (!error.code) error.code = ERROR_CODE.UNKNOWN_ERROR;
      const {
        code = ERROR_CODE.UNKNOWN_ERROR.code,
        http_status = ERROR_CODE.UNKNOWN_ERROR.http_status,
      } = error.code;

      const message = error.message || error.code.message;
      const { data } = error;
      // let debug;
      // if (env.logLevel === 'debug') {
      //     debug = err.message;
      // }
      return res.status(http_status).json(base(STATUS.FAIL, {
        code,
        message,
        data,
        // message: err.message, // Original output
        // debug
      }));
    },
  };
};

module.exports = responseHelper;
