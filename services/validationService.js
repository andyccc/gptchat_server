/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
const { Validator } = require('jsonschema');
const {
  login, chat, orderCreate, orderUpdate, orderRestore,
} = require('../models/schema/user');
const { CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const { logger } = require('../utils/logger');

const validationService = {
  checkLogin: (body) => validationService.handleValidatorResult(body, login),
  checkChat: (body) => validationService.handleValidatorResult(body, chat),
  checkOrderCreate: (body) => validationService.handleValidatorResult(body, orderCreate),
  checkOrderUpdate: (body) => validationService.handleValidatorResult(body, orderUpdate),
  checkOrderRestore: (body) => validationService.handleValidatorResult(body, orderRestore),

  handleValidatorResult: (body, schema, isPortalOneTime) => {
    const validator = new Validator();
    const validatorResult = validator.validate(body, schema);
    if (validatorResult.errors && validatorResult.errors.length > 0) {
      const { errors } = validatorResult;
      let stack = '';
      logger.error(`Parameter Format Error ==> ${JSON.stringify(errors)}, data: ${JSON.stringify(body)}`);
      if (isPortalOneTime) {
        const errorPath = errors[0].path;
        const [first, second = undefined] = errorPath;
        // get error field name
        let errorField = first;
        if (second !== undefined) {
          errorField = second;
        }
        throw new CustomError({
          code: ERROR_CODE.BAD_REQUEST,
          message: `${errorField} ${errors[0].message}`,
        });
      }
      errors.forEach((item) => {
        stack += `${item.stack}, `;
      });
      return stack;
    }
    return '';
  },

};

module.exports = validationService;
