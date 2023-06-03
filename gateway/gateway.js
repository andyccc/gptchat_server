/* eslint-disable no-return-await */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
const axios = require('axios');
const common = require('../utils/common');
const { CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');

class Gateway {
  constructor() {

  }

  async request(path, method, data = null, headers = null) {
    if (common.isEmpty(this.endpoint)) {
      throw new CustomError({ message: 'endpoint cannot be empty', code: ERROR_CODE.INTERNAL_SERVER_ERROR });
    }
    return await axios.request({
      url: `${this.endpoint}${path}`,
      method,
      headers,
      data,
    });
  }
}

module.exports = Gateway;
