const { logger } = require('../../utils/logger');
const orderService = require('../../services/orderService');

const webhook = {

  appStore: async (req, res, next) => {
    try {
      logger.info(`webhook notify request ==> path: ${req.originalUrl}, header: ${JSON.stringify(req.headers)}, query: ${JSON.stringify(req.query)}, params: ${JSON.stringify(req.params)}, body: ${JSON.stringify(req.body)}`);

      await orderService.verifyNotifyReceiptV2(req, res);
    } catch (e) {
      next(e);
    }
  },

  appStore_v1: async (req, res, next) => {
    try {
      logger.info(`webhook notify request ==> path: ${req.originalUrl}, header: ${JSON.stringify(req.headers)}, query: ${JSON.stringify(req.query)}, params: ${JSON.stringify(req.params)}, body: ${JSON.stringify(req.body)}`);

      await orderService.verifyNotifyReceiptV1(req, res);
    } catch (e) {
      next(e);
    }
  },

};

module.exports = webhook;
