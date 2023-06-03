/* eslint-disable no-return-await */
const fetch = require('node-fetch');
const { logger } = require('../utils/logger');
const { env } = require('../config');
const { HttpError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');

const request = async (method, url, reqData = null, headers = null) => {
  const content = {
    method,
    timeout: env.timeout,
  };

  if (reqData) {
    content.body = JSON.stringify(reqData);
  }

  if (headers) {
    content.headers = headers;
  }

  try {
    const response = await fetch(url, content);

    const body = await response.text();

    if (response.status < 200 || response.status >= 300) {
      logger.error(`HTTP Error Response ${response.status} ${response.statusText} body: ${body}`);
    }

    return JSON.parse(body);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new HttpError({ message: `HTTP request unavailable ==> url: ${url}`, code: ERROR_CODE.GATEWAY_UNAVAILABLE });
    }
    if (e instanceof fetch.FetchError) {
      if (e.type === 'request-timeout') {
        throw new HttpError({ message: `HTTP request timeout ==> url: ${url}`, code: ERROR_CODE.GATEWAY_TIMEOUT });
      }
    }
    throw new HttpError({ message: `HTTP Error Response: ${e.message}`, code: ERROR_CODE.GATEWAY_ERROR });
  }
};

const get = async (url, headers) => await request('GET', url, null, headers);

const post = async (url, reqData, headers) => await request('POST', url, reqData, headers);

const patch = async (url, reqData, headers) => await request('PATCH', url, reqData, headers);

const deleted = async (url, headers) => await request('DELETE', url, null, headers);

module.exports = {
  get,
  post,
  patch,
  deleted,
};
