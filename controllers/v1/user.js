const { logger } = require('../../utils/logger');
const validationService = require('../../services/validationService');
const backendUserAccount = require('../../services/userAccountService');

const user = {

  login: async (req, res, next) => {
    try {
      const { body = {} } = req;
      logger.info(`login request ==> path: ${req.path}, body: ${JSON.stringify(body)}`);
      validationService.checkLogin(body);
      return await backendUserAccount.login(req, res);
    } catch (e) {
      next(e);
    }
    return null;
  },

};

module.exports = user;
