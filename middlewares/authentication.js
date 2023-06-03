/* eslint-disable camelcase */
const { CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const daoUser = require('../models/daoUser');
const { logger } = require('../utils/logger');

const authentication = async (req, res, next) => {
  try {
    const { auth = {} } = req;
    const result = await daoUser.slave.getUserByID(auth.id);
    if (result.is_deleted !== '0') {
      throw new CustomError({ message: 'user not active', code: ERROR_CODE.UNAUTHORIZED });
    }

    logger.info(`authentication pass ==> user id: ${auth.id}`);

    next();
  } catch (e) {
    next(e);
  }
};
module.exports = authentication;
