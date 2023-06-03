const responseHelper = require('../utils/response_helper');

const status = {
  getStatus: async (req, res) => responseHelper(res).status(),
  getHealth: (req, res) => responseHelper(res).status(),
};

module.exports = status;
