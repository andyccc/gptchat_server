const common = require('../utils/common');
const { env } = require('../config');

/* eslint-disable no-param-reassign */
const ENCRYPT_FIELD = ['bankCardNum', 'idNum', 'swiftCode'];
const loopEncryptObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (typeof (value) === 'object') {
        loopEncryptObject(value);
      } else if (ENCRYPT_FIELD.includes(key)) {
        object[key] = common.encrypt(value, env.symetricKey, env.symetricIv);
      }
    }
  });
  return object;
};

const encryptClient = {
  encryptObject: (object) => {
    const obj = JSON.parse(JSON.stringify(object));
    return loopEncryptObject(obj);
  },
};
module.exports = encryptClient;
