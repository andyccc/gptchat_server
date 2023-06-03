/* eslint-disable camelcase */
const { CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const { logger } = require('../utils/logger');

const authorization = async (req, res, next) => {
  try {
    const { routeList, id } = req.auth;
    // routeList string to array
    const routes = routeList.split(',');
    const currentRoute = `${req.method}|${req.route.path}`;
    // check current route in routes
    if (!routes.includes(currentRoute)) {
      throw new CustomError({ message: 'User does not have permission', code: ERROR_CODE.UNAUTHORIZED });
    }
    logger.info(`authorization pass ==> user id = ${id}`);

    next();
  } catch (e) {
    next(e);
  }
};
module.exports = authorization;
