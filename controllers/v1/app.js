const { logger } = require('../../utils/logger');
const responseHelper = require('../../utils/response_helper');

const app = {
  index: async (req, res, next) => {
    try {
      logger.info(`app version request ==> path: ${req.path} params: ${JSON.stringify(req.params)} user id: ${(req.auth || {}).id}`);

      return responseHelper(res).success({
        version: '1.0.0',
        versionCode: '1',
        note: '有一个有新版本呢',
        platform: '1',
        force: 'false',
      });
    } catch (e) {
      return next(e);
    }
  },

};

module.exports = app;
