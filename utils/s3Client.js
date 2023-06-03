const fs = require('fs');
const AWS = require('aws-sdk');
const { logger } = require('./logger');
const { bucketName } = require('../config/env').awsBucket;

const { sleep } = require('./common');

const RETRY_COUNT = 3;

const RetryAction = async (action, { retriesLeft = RETRY_COUNT, timeout = 5000, tag = '' }) => {
  try {
    const result = await action();
    return result;
  } catch (error) {
    logger.error(`action try [${tag}] error: '${error}', after ${timeout}ms again try count ${RETRY_COUNT - retriesLeft + 1}`);
    if (retriesLeft) {
      // sleep 5 seconds
      await sleep(timeout);
      // try left count
      return RetryAction(action, { retriesLeft: retriesLeft - 1, timeout, tag });
    }
    logger.error(`action try [${tag}] reach max count always error!`);
    // throw error;
  }
  return null;
};
const s3 = new AWS.S3();
const S3Client = {

  retryUpload: async (filename, filePath, folder = '') => RetryAction(() => new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${filename}`,
      Body: fileContent,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Location);
    });
  }), { tag: 'batch file upload' }),

  upload: async (filename, filePath, folder = '') => new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucketName,
      Key: `${folder}/${filename}`,
      Body: fileContent,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Location);
    });
  }),

  putObject: async (filename, content, folder = '') => new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${filename}`,
      Body: content,
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Location);
    });
  }),

  getObject: async (filePath) => {
    const params = {
      Bucket: bucketName,
      Key: filePath,
    };

    return s3.getObject(params).createReadStream();
  },

};

module.exports = S3Client;
