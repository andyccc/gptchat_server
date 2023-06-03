/* eslint-disable max-len */
/* eslint-disable no-return-await */
const Gateway = require('../gateway');

class VendorGateway extends Gateway {
  async request(path, method, payload = null, header = null) {
    let headers = {

    };

    if (header) {
      headers = Object.assign(header, headers);
    }

    return await super.request(path, method, payload, headers);
  }
}

module.exports = VendorGateway;
