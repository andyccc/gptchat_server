/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const http = require('http');
const express = require('express');
const request = require('supertest');
const { expressjwt } = require('express-jwt');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const v1 = require('../routes/v1');
const { env } = require('../config');
const responseHelper = require('../utils/response_helper');
const { CustomError, DbError, HttpError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const common = require('../utils/common');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json({
  type: [
    'application/json',
    'application/*+json',
  ],
}));
const router = require('../routes');

app.use(expressjwt({
  secret: env.jwtSecret,
  algorithms: ['HS256'],
}).unless({
  path: [
    '/v1/login',
    '/v1/otp',
    '/v1/health',
    { url: /^\/v1\/webhook\/.*/ },
  ],
}));

router(app);

app.use((err, req, res, next) => {
  if (err instanceof DbError) {
    if (!err.code) err.code = ERROR_CODE.INTERNAL_SERVER_ERROR;
  } else if (err instanceof HttpError) {
    if (!err.code) err.code = ERROR_CODE.GATEWAY_ERROR;
  } else if (err instanceof CustomError) {
    if (!err.code) err.code = ERROR_CODE.UNKNOWN_ERROR;
  } else if (err instanceof Error) {
    if (!err.code) err.code = ERROR_CODE.INTERNAL_SERVER_ERROR;
  } else {
    err = new CustomError({
      message: 'not defined err',
      code: ERROR_CODE.UNKNOWN_ERROR,
    });
  }

  return responseHelper(res).fail(err);
});

const server = http.createServer(app);

// const { port } = env;
// server.listen('9528', () => {
// });

const { closeMysqlConnection } = require('../libs/mysql');

const userData = {
  apiKey: '6cf5533f-f57f-448f-b53d-727c0e2962e3',
  userName: 'test',
  passWord: 'test',
};

module.exports = {
  request,
  app,
  closeMysqlConnection,
  userData,
  common,
};
