const { ERROR_CODE } = require('../../error/error_code');
const openaiService = require('../../services/openaiService');
const { logger } = require('../../utils/logger');

const validationService = require('../../services/validationService');
// const responseHelper = require('../../utils/response_helper');

const openai = {

  completions: async (req, res, next) => {
    try {
      logger.info(`completions request ==> path: ${req.path}, body: ${JSON.stringify(req.body)}, user id: ${(req.auth || {}).id}`);
      validationService.checkChat(req.body);

      await openaiService.completions(req, res);
    } catch (e) {
      if (e.message === ERROR_CODE.VIP_EXPIRED.message) {
        // responseHelper(res).fail(e);
        res.status(405).json({
          error: {
            message: e.message,
            type: 'vip_expired',
            param: null,
            code: null,
          },
        });
      }

      next(e);
    }
  },

};

module.exports = openai;
