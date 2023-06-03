/* eslint-disable max-len */
const dbBase = require('./daoBase');
const { DbError, CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const {
  INSERT_ORDER, UPDATE_ORDER_BY_ID, FIND_ORDER_BY_ID, FIND_ORDER_BY_TRANSACTION_ID, UPDATE_ORDER_OWNER_BY_ID, FIND_ORDER_BY_PRODUCT_ID, UPDATE_ORDER_STATUS_BY_ID,
} = require('../sqls/order');

class DaoOrder extends dbBase {
  saveOrder(order) {
    return new Promise((resolve, reject) => {
      this.pool.query(INSERT_ORDER, [
        order.product_id, order.user_id, order.platform,
      ], (err, results) => {
        if (err) {
          reject(new DbError({ message: err.message }));
        } else {
          resolve(results);
        }
      });
    });
  }

  updateOrder(order) {
    return new Promise((resolve, reject) => {
      this.pool.query(
        UPDATE_ORDER_BY_ID,
        [
          order.status, order.transaction_id, order.transaction_receipt, order.transaction_purchase_date, order.original_transaction_id,
          order.transaction_expiration_date, order.quantity,

          order.id],
        (err, results) => {
          if (err) {
            reject(new DbError({ message: err.message }));
          } else if (results.length === 0) {
            reject(new CustomError({ message: 'not found order', code: ERROR_CODE.NOT_FOUND }));
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  getOrderByID(orderId, userId, productId) {
    return new Promise((resolve, reject) => {
      this.pool.query(FIND_ORDER_BY_ID, [orderId, userId, productId], (err, results) => {
        if (err) {
          const error = new DbError({ message: err.message });
          reject(error);
        } else if (results.length === 0) {
          reject(new CustomError({ message: 'not found order', code: ERROR_CODE.NOT_FOUND }));
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  getOrderByProductID(userId, productId) {
    return new Promise((resolve, reject) => {
      this.pool.query(FIND_ORDER_BY_PRODUCT_ID, [userId, productId], (err, results) => {
        if (err) {
          const error = new DbError({ message: err.message });
          reject(error);
        // } else if (results.length === 0) {
        //   reject(new CustomError({ message: 'not found order', code: ERROR_CODE.NOT_FOUND }));
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  getOrderByTransactionId(transactionId, originalTransactionId, productId) {
    return new Promise((resolve, reject) => {
      this.pool.query(FIND_ORDER_BY_TRANSACTION_ID, [originalTransactionId || transactionId, productId], (err, results) => {
        if (err) {
          const error = new DbError({ message: err.message });
          reject(error);
        } else if (results.length === 0) {
          reject(new CustomError({ message: 'not found order', code: ERROR_CODE.NOT_FOUND }));
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  updateOrderOwner(userId, orderId, status) {
    return new Promise((resolve, reject) => {
      this.pool.query(
        UPDATE_ORDER_OWNER_BY_ID,
        [
          userId, status, orderId],
        (err, results) => {
          if (err) {
            reject(new DbError({ message: err.message }));
          } else if (results.length === 0) {
            reject(new CustomError({ message: 'not found order', code: ERROR_CODE.NOT_FOUND }));
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  updateOrderStatus(orderId, status) {
    return new Promise((resolve, reject) => {
      this.pool.query(
        UPDATE_ORDER_STATUS_BY_ID,
        [
          status, orderId],
        (err, results) => {
          if (err) {
            reject(new DbError({ message: err.message }));
          } else if (results.length === 0) {
            reject(new CustomError({ message: 'not found order', code: ERROR_CODE.NOT_FOUND }));
          } else {
            resolve(results);
          }
        },
      );
    });
  }
}

module.exports = new DaoOrder();
