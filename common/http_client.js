/* eslint-disable no-param-reassign */
const { CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const {
  get, post, patch, deleted,
} = require('../libs/fetch');
const { logger } = require('../utils/logger');
const filterClient = require('./filter_client');

const httpClient = {

  httpRequest: async ({
    url, method, payload, header,
  }) => {
    if (method === 'GET') {
      const paramStr = httpClient.contactParams(payload);
      if (paramStr) url = `${url}?${paramStr}`;
    }

    logger.info(`HttpRequest ${method} url: ${url} body: ${JSON.stringify(filterClient.filterObject(payload))} header: ${JSON.stringify(header)}`);

    let res;

    let headers = {

    };
    if (header) {
      headers = Object.assign(header, headers);
    }

    if (method === 'GET') {
      res = await get(url, headers);
    } else if (method === 'POST') {
      res = await post(url, payload, headers);
    } else if (method === 'PATCH') {
      res = await patch(url, payload, header);
    } else if (method === 'DELETE') {
      res = await deleted(url, header);
    } else {
      throw new CustomError({ message: 'Unsupported request method', code: ERROR_CODE.INTERNAL_SERVER_ERROR });
    }

    logger.info(`HttpResponse ${url}: ${JSON.stringify(filterClient.filterObject(res))}`);

    return res;
  },

  contactParams: (params) => {
    let sPara = [];
    if (!params) return '';
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        sPara.push([key, encodeURIComponent(params[key])]);
      }
    });
    sPara = sPara.sort();
    let prestr = '';
    sPara.forEach((value) => {
      prestr += `&${value[0]}=${value[1]}`;
    });
    return prestr.substring(1);
  },

};

module.exports = httpClient;
