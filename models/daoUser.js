/* eslint-disable camelcase */
const dbBase = require('./daoBase');
const { DbError, CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const {
  FIND_USER_BY_ID,
  FIND_USER_BY_DEVICE_NUMBER,
  INSERT_USER,
  UPDATE_USER_EXPIRE_BY_ID,
  UPDATE_USER_PAYMENT_BY_ID,
} = require('../sqls/user');

class DaoUser extends dbBase {
  getUserByDeviceNumber(deviceNumber) {
    return new Promise((resolve, reject) => {
      this.pool.query(FIND_USER_BY_DEVICE_NUMBER, [deviceNumber], (err, results) => {
        if (err) {
          const error = new DbError({ message: err.message });
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  saveUser(user) {
    return new Promise((resolve, reject) => {
      this.pool.query(INSERT_USER, [
        user.vip_expire_unix, user.count, user.advert_residue, user.device_number, user.timezone,
      ], (err, results) => {
        if (err) {
          reject(new DbError({ message: err.message }));
        } else {
          resolve(results);
        }
      });
    });
  }

  updateUserExpireById(id) {
    return new Promise((resolve, reject) => {
      this.pool.query(
        UPDATE_USER_EXPIRE_BY_ID,
        [
          id],
        (err, results) => {
          if (err) {
            reject(new DbError({ message: err.message }));
            //   } else if (results.length === 0) {
            //     reject(new CustomError({ message: 'not found user', code: ERROR_CODE.NOT_FOUND }));
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  updateUserPaymentById(id, vip_expire_unix, product_id) {
    return new Promise((resolve, reject) => {
      this.pool.query(
        UPDATE_USER_PAYMENT_BY_ID,
        [
          vip_expire_unix, product_id,
          id],
        (err, results) => {
          if (err) {
            reject(new DbError({ message: err.message }));
          } else if (results.length === 0) {
            reject(new CustomError({ message: 'not found user', code: ERROR_CODE.NOT_FOUND }));
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  getUserByID(userId) {
    return new Promise((resolve, reject) => {
      // console.log(userId, 'userId');
      this.pool.query(FIND_USER_BY_ID, [userId], (err, results) => {
        if (err) {
          const error = new DbError({ message: err.message });
          reject(error);
        } else if (results.length === 0) {
          reject(new CustomError({ message: 'not found user', code: ERROR_CODE.NOT_FOUND }));
        } else {
          resolve(results[0]);
        }
      });
    });
  }
}

module.exports = new DaoUser();
