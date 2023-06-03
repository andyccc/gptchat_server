/* eslint-disable max-len */
const uuid = require('uuid');
const { customAlphabet } = require('nanoid');
const crypto = require('crypto');

const common = {
  sleep: (milliseconds) => new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  }),
  decrypt: (data, key, iv) => {
    const crypted = Buffer.from(data, 'base64');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
  },
  encrypt: (data, key, iv) => {
    const decipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return decipher.update(data, 'binary', 'base64') + decipher.final('base64');
  },
  md5: (data) => crypto.createHash('md5').update(data).digest('hex'),
  isEmpty: (input) => input === null || input === undefined || input === '' || JSON.stringify(input) === '{}' || JSON.stringify(input) === '[]',

  isNotEmpty: (input) => !common.isEmpty(input),
  isDateString: (input) => {
    const r = /^\d{4}-\d{2}-\d{2}$/;
    return r.test(input);
  },

  /**
     * @param {String} prefix
     * @return {String}
     */
  generateUUID: (prefix = null) => {
    let uuidStr = uuid.v1();
    uuidStr = uuidStr.replace(/-/g, '');
    if (prefix != null) {
      uuidStr = prefix + uuidStr;
    }
    return uuidStr;
  },
  generateNanoID: (length = 8, prefix = null) => {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', length);
    let nanoidStr = nanoid(); if (prefix != null) {
      nanoidStr = prefix + nanoidStr;
    }
    return nanoidStr;
  },

  /**
     * @getAuthorization
     * @desc  get authorization
     * @param {Object} req
     */
  getAuthorization: (req) => {
    const authorization = req.headers.authorization ? req.headers.authorization : req.headers.Authorization;
    return String(authorization || '').split(' ').pop();
  },

  /**
     * @getClientIP
     * @desc get client ip
     * @param {Object} req
     */
  getClientIP: (req) => req.headers['x-forwarded-for']
            || req.connection.remoteAddress
            || req.socket.remoteAddress
            || req.connection.socket.remoteAddress,

  getNewSqlParamEntity: (sql, params, callback) => {
    if (callback) {
      return callback(null, {
        sql,
        params,
      });
    }
    return {
      sql,
      params,
    };
  },

  getS3FilePath: (filePath) => {
    const index = filePath.indexOf('com/') + 4;
    return filePath.substring(index);
  },
  // first letter toUpperCase
  ucFirst: (str) => {
    const firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
  },

};
module.exports = common;
