/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const responseHelper = require('../utils/response_helper');
const { CustomError } = require('../error/error');
const daoUser = require('../models/daoUser');
const { ERROR_CODE } = require('../error/error_code');
const { env } = require('../config');
const { logger } = require('../utils/logger');

const BackendUserAccount = {

  login: async (req, res) => {
    const { device_number, timezone } = req.body;

    const client = {
      platform: `${req.headers.platform}`,
      device_name: `${req.headers['user-agent']}`,
      ver: `${req.headers.ver}.${req.headers.build}`,
    };

    let user = await daoUser.slave.getUserByDeviceNumber(device_number);
    if (user) {
      await daoUser.master.updateUserExpireById(user.id, client);
      user = await daoUser.slave.getUserByDeviceNumber(device_number);
    } else {
      user = {
        vip_expire_unix: 0,
        count: 0,
        advert_residue: 3,
        device_number,
        timezone,
      };

      Object.assign(user, client);

      const result = await daoUser.master.saveUser(user);
      user.id = result.insertId;
    }
    const access_token = jwt.sign({
      id: user.id,
    }, env.jwtSecret, {
      expiresIn: env.jwtTokenExpiry,
    });

    const access_expire = 1;
    const refresh_after = 1;

    const resultUser = {
      id: user.id,
      vip_expire_unix: user.vip_expire_unix,
      count: user.count,
      advert_residue: user.advert_residue,
    };

    if (user.product_id) {
      resultUser.product_id = user.product_id;
    }

    logger.info(`login result: ${JSON.stringify(resultUser)}`);

    return responseHelper(res).success({
      code: ERROR_CODE.SUCCESS.code,
      stream: true,
      access_token,
      access_expire,
      refresh_after,
      user: resultUser,
    });
  },

  checkUserExpire: async (req, res) => {
    // throw new CustomError({
    //   code: ERROR_CODE.VIP_EXPIRED,
    //   message: 'VIP has expired.',
    // });

    const userId = req.auth.id;
    const user = await daoUser.master.getUserByID(userId);
    if (user.vip_expire_unix < Date.now() && user.count <= 0) {
      throw new CustomError({
        code: ERROR_CODE.VIP_EXPIRED,
        message: 'VIP has expired.',
      });
    }
  },

};

module.exports = BackendUserAccount;
