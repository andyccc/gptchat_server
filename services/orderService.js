/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

const verifyReceipt = require('node-apple-receipt-verify');
const fs = require('fs');
const crypto = require('crypto');
const pkcs7 = require('node-pkcs7');
const jws = require('jws');
const jwt = require('jsonwebtoken');
const { ERROR_CODE } = require('../error/error_code');
const daoOrder = require('../models/daoOrder');
const daoUser = require('../models/daoUser');
const responseHelper = require('../utils/response_helper');
const { convertTimestamp, timeAddMonths, timeAddYears } = require('../common/date_client');
const { logger } = require('../utils/logger');

const verifyReceiptEnvironment = process.env.NODE_ENV === 'development' ? 'sandbox' : 'production';

const orderService = {
  createOrder: async (req, res) => {
    const { product_id } = req.body;
    const userId = req.auth.id;

    // duplicate order check, if exist in db, will give up current order
    const order = await daoOrder.master.getOrderByProductID(userId, product_id);
    if (order && order.status !== 3 && order.status !== 4) {
      return responseHelper(res).success({
        code: ERROR_CODE.SUCCESS.code,
        id: order.id,
      });
    }

    const params = {
      product_id,
      platform: 1,
      user_id: userId,
    };

    const result = await daoOrder.master.saveOrder(params);

    return responseHelper(res).success({
      code: ERROR_CODE.SUCCESS.code,
      id: result.insertId,
    });
  },

  verifyReceipt: async (transaction_receipt, _product_id, transaction_id, _original_transaction_id) => {
    let purchase_date = '';
    let expiration_date = '';
    let original_transaction_id = _original_transaction_id;
    let quantity = 0;
    let product_id = _product_id;
    let valid = false;
    verifyReceipt.config({
      secret: 'c43299794c8f433284ac38ccb7b343fd',
      verbose: true,
      environment: [verifyReceiptEnvironment],

    //   ignoreExpired: false,
    //   extended: true,
    //   excludeOldTransactions: true,
    });

    const products = await verifyReceipt.validate({
      receipt: transaction_receipt,
      // device: '',
    });
    const count = products.length;
    logger.info(`verified products: ${count}, ${JSON.stringify(products)}`);

    if (!products || products.length === 0) {
      return {
        valid,
      };
    }

    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];

      if (product.bundleId !== 'com.yxc.gptchat') {
        continue;
      }

      //   const expireTime = orderService.getProductExpireDataById(product.productId);
      //   if (expireTime < Date.now() / 1000) {
      //     continue;
      //   }

      if (product_id && product.productId !== product_id) {
        continue;
      }

      if (product.expirationDate <= Date.now()) {
        continue;
      }

      if (product.transactionId && product.transactionId === transaction_id) {
        valid = true;
        purchase_date = product.purchaseDate;
        expiration_date = product.expirationDate;
        original_transaction_id = product.originalTransactionId;
        quantity = product.quantity;
        product_id = product.productId;

        break;
      }

      if (product.originalTransactionId && product.originalTransactionId === `${original_transaction_id}`) {
        valid = true;
        purchase_date = product.purchaseDate;
        expiration_date = product.expirationDate;
        original_transaction_id = product.originalTransactionId;
        quantity = product.quantity;
        product_id = product.productId;

        break;
      }

      if (product.originalTransactionId && product.originalTransactionId === transaction_id) {
        valid = true;
        purchase_date = product.purchaseDate;
        expiration_date = product.expirationDate;
        original_transaction_id = product.originalTransactionId;
        quantity = product.quantity;
        product_id = product.productId;
        break;
      }
    }
    return {
      valid, purchase_date, expiration_date, transaction_id, original_transaction_id, quantity, product_id,
    };
  },

  getProductExpireDataById: (product_id, purchaseDate) => {
    if (product_id === '1002' || product_id === '10002') {
      // add 1 month
      //   return timeAddMonths(order.time_created, 1);
      return timeAddMonths(purchaseDate, 1);
    }

    if (product_id === '1003' || product_id === '10003') {
      // add 1 year
      //   return timeAddYears(order.time_created, 1);
      return timeAddYears(purchaseDate, 1);
    }

    return 0;
  },

  updateOrder: async (req, res) => {
    const {
      order_id, product_id, transaction_id, transaction_date, transaction_receipt, original_transaction_id,
    } = req.body;

    const userId = req.auth.id;

    const order = await daoOrder.master.getOrderByID(order_id, userId, product_id);

    try {
      const validData = await orderService.verifyReceipt(transaction_receipt, product_id, transaction_id, original_transaction_id);

      if (!validData.valid) {
        responseHelper(res).fail({
          code: ERROR_CODE.NOT_FOUND.code,
        });
        return;
      }

      await daoOrder.master.updateOrder({
        id: order_id,
        status: 1,
        transaction_id,
        transaction_purchase_date: validData.purchase_date,
        transaction_receipt,
        original_transaction_id: validData.original_transaction_id,
        transaction_expiration_date: validData.expiration_date,
        quantity: validData.quantity,
      });

      //   const vip_expire_unix = orderService.getProductExpireDataById(product_id, validData.purchase_date) * 1000;

      const vip_expire_unix = validData.expiration_date;
      await daoUser.master.updateUserPaymentById(userId, vip_expire_unix, product_id);

      return responseHelper(res).success({
        code: ERROR_CODE.SUCCESS.code,
        id: order_id,
        product_id,
      });

    // failed
    } catch (e) {
      logger.error(e);

      if (e instanceof verifyReceipt.EmptyError) {
        // todo
      } if (e instanceof verifyReceipt.ServiceUnavailableError) {
        // todo
      } else {
        // todo
      }
    }
    return responseHelper(res).fail({
      code: ERROR_CODE.UNKNOWN_ERROR.code,
    });
  },

  abandon: async (req, res) => {
    const { order_id, product_id } = req.params;
    const userId = req.auth.id;

    const order = await daoOrder.master.getOrderByID(order_id, userId, product_id);
    if (order.status === 0) {
      await daoOrder.master.updateOrderStatus(order_id, 4);
    }

    return responseHelper(res).success({
      code: ERROR_CODE.SUCCESS.code,
    });
  },

  restoreOrder: async (req, res) => {
    const {
    //   order_id, product_id,
      transaction_id, transaction_date, transaction_receipt, original_transaction_id,
    } = req.body;

    const userId = req.auth.id;

    try {
      const validData = await orderService.verifyReceipt(transaction_receipt, null, transaction_id, original_transaction_id);

      // check data
      if (!validData.valid) {
        responseHelper(res).fail({
          code: ERROR_CODE.NOT_FOUND.code,
        });
        return;
      }

      const order = await daoOrder.master.getOrderByTransactionId(transaction_id, original_transaction_id, validData.product_id);

      // refresh order
      await daoOrder.master.updateOrder({
        id: order.id,
        status: 1,
        transaction_id,
        transaction_purchase_date: validData.purchase_date,
        transaction_receipt,
        original_transaction_id: validData.original_transaction_id,
        transaction_expiration_date: validData.expiration_date,
        quantity: validData.quantity,
      });
      // update to current user
      const oldUserId = order.user_id;
      const vip_expire_unix = validData.expiration_date;
      await daoUser.master.updateUserPaymentById(userId, vip_expire_unix, order.product_id);

      if (userId === oldUserId) {
        return responseHelper(res).success({
          code: ERROR_CODE.SUCCESS.code,
          id: order.id,
          product_id: order.product_id,
        });
      }

      // 1. update new user to order
      await daoOrder.master.updateOrderOwner(userId, order.id, 2);

      // 2. and empty old user
      await daoUser.master.updateUserPaymentById(oldUserId, 0, '');

      return responseHelper(res).success({
        code: ERROR_CODE.SUCCESS.code,
        id: order.id,
        product_id: order.product_id,
      });
    // failed
    } catch (e) {
      logger.error(e);

      if (e instanceof verifyReceipt.EmptyError) {
        // todo
      } if (e instanceof verifyReceipt.ServiceUnavailableError) {
        // todo
      } else {
        // todo
      }
    }
    return responseHelper(res).fail({
      code: ERROR_CODE.UNKNOWN_ERROR.code,
    });
  },

  verifyNotifyReceiptV2: async (req, res) => {
    // https://developer.apple.com/documentation/appstoreservernotifications/notification_type
    // https://cloud.tencent.com/developer/article/2217344
    // https://juejin.cn/post/7056976669139009573

    const decoded = jwt.decode(req.body.signedPayload, { complete: true });
    const { header, payload, signature } = decoded;
    const publicKeyString = header.x5c[0];
    const { notificationType } = payload;
    if (notificationType === 'CANCEL') {
      //

    } else if (notificationType === 'REFUND') {
      //

    } else if (notificationType === 'REVOKE') {
      //

    }

    // 将字符串形式的公钥转换为缓冲区（Buffer）对象
    // const publicKeyBuffer = Buffer.from(publicKeyString, 'base64');

    // 生成 PEM 格式的公钥
    // const publicKeyPEM = `-----BEGIN CERTIFICATE-----\n${publicKeyBuffer.toString('base64')}\n-----END CERTIFICATE-----`;
    const publicKeyPEM = `-----BEGIN CERTIFICATE-----\n${publicKeyString}\n-----END CERTIFICATE-----`;

    jwt.verify(payload.data.signedTransactionInfo, publicKeyPEM, { algorithms: header.alg }, async (err, data) => {
      if (err) {
        logger.info('Verification failed:', err.message);
        res.status(400).send('fail');
        return;
      }

      logger.info(`Verification succeeded: ${JSON.stringify(data)}`);

      const {
        transactionId, originalTransactionId, purchaseDate, expiresDate, environment, bundleId, productId, inAppOwnershipType,
      } = data;
      if (bundleId !== 'com.yxc.gptchat') {
        res.status(400).send('fail');
        logger.info(`check bundleId failed: ${bundleId}`);

        return;
      }

      if (inAppOwnershipType === 'PURCHASED') {
        const order = await daoOrder.master.getOrderByTransactionId(transactionId, originalTransactionId, productId);
        const validData = await orderService.verifyReceipt(order.transaction_receipt, order.product_id, transactionId, originalTransactionId);
        if (!validData.valid) {
          logger.info(`check validData failed: ${bundleId}`);
          res.status(400).send('fail');
          return;
        }

        // refresh order
        await daoOrder.master.updateOrder({
          id: order.id,
          status: 1,
          transaction_id: transactionId,
          transaction_purchase_date: validData.purchase_date,
          transaction_receipt: order.transaction_receipt,
          original_transaction_id: validData.original_transaction_id,
          transaction_expiration_date: validData.expiration_date,
          quantity: validData.quantity,
        });

        await daoUser.master.updateUserPaymentById(order.user_idId, validData.expiration_date, validData.product_id);

        res.status(200).send('ok');
      }
    });
  },

  verifyNotifyReceiptV1: async (req, res) => {
    const {
      original_transaction_id, auto_renew_status_change_date_ms, auto_renew_status, password, unified_receipt = {},
    } = req.body;

    const receipt = unified_receipt.latest_receipt;

    const validData = await orderService.verifyReceipt(receipt, null, null, original_transaction_id);
    if (!validData.valid) {
      res.status(400).send('failed');
      return;
    }

    const order = await daoOrder.master.getOrderByTransactionId(null, original_transaction_id, validData.product_id);

    if (auto_renew_status === 'false') {
      // cancel action

      await daoOrder.master.updateOrder({
        id: order.id,
        status: 3,
        transaction_id: validData.transaction_id,
        transaction_purchase_date: validData.purchase_date,
        transaction_receipt: receipt,
        original_transaction_id: validData.original_transaction_id,
        transaction_expiration_date: auto_renew_status_change_date_ms,
        quantity: validData.quantity,
      });

      await daoUser.master.updateUserPaymentById(order.user_id, 0, '');
    } else {
      await daoOrder.master.updateOrder({
        id: order.id,
        status: order.status === 0 ? 1 : order.status,
        transaction_id: validData.transaction_id,
        transaction_purchase_date: validData.purchase_date,
        transaction_receipt: receipt,
        original_transaction_id: validData.original_transaction_id,
        transaction_expiration_date: validData.expiration_date,
        quantity: validData.quantity,
      });

      await daoUser.master.updateUserPaymentById(order.user_id, validData.expiration_date, order.product_id);
    }
    res.status(200).send('ok');
  },

};

module.exports = orderService;
