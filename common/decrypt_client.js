const common = require('../utils/common');
const { env } = require('../config');

/* eslint-disable no-param-reassign */
const DECRYPT_FIELD = ['bankCardNum', 'idNum', 'swiftCode'];
const loopDecryptObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (typeof (value) === 'object') {
        loopDecryptObject(value);
      } else if (DECRYPT_FIELD.includes(key)) {
        object[key] = common.decrypt(value, env.symetricKey, env.symetricIv);
      }
    }
  });
  return object;
};

const decryptClient = {
  decryptObject: (object) => {
    const obj = JSON.parse(JSON.stringify(object));
    return loopDecryptObject(obj);
  },
};
module.exports = decryptClient;
