const health = require('./status_check');
const v1 = require('./v1');

module.exports = (app) => {
  app.use('/v1', health);
  app.use('/v1', v1);
};
