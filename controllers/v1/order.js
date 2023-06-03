const { logger } = require('../../utils/logger');
const validationService = require('../../services/validationService');
const orderService = require('../../services/orderService');

const order = {

  create: async (req, res, next) => {
    try {
      const { body = {} } = req;

      logger.info(`order create request ==> path: ${req.path}, body: ${JSON.stringify(body)}, user id: ${(req.auth || {}).id}`);

      validationService.checkOrderCreate(body);
      return await orderService.createOrder(req, res);
    } catch (e) {
      next(e);
    }
    return null;
  },

  update: async (req, res, next) => {
    try {
      const { body = {} } = req;
      logger.info(`order update request ==> path: ${req.path}, body: ${JSON.stringify(body)}, user id: ${(req.auth || {}).id}`);
      validationService.checkOrderUpdate(body);
      return await orderService.updateOrder(req, res);
    } catch (e) {
      next(e);
    }
    return null;
  },

  restore: async (req, res, next) => {
    try {
      const { body = {} } = req;
      logger.info(`order restore request ==> path: ${req.path}, body: ${JSON.stringify(body)}, user id: ${(req.auth || {}).id}`);
      validationService.checkOrderRestore(body);
      return await orderService.restoreOrder(req, res);
    } catch (e) {
      next(e);
    }
    return null;
  },

  abandon: async (req, res, next) => {
    try {
      const { body = {} } = req;
      logger.info(`order abandon request ==> path: ${req.path}, body: ${JSON.stringify(body)}, user id: ${(req.auth || {}).id}`);
      return await orderService.abandon(req, res);
    } catch (e) {
      next(e);
    }
    return null;
  },
};

module.exports = order;
