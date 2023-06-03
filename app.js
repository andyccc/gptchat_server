/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
require('dotenv').config();
require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const { expressjwt, UnauthorizedError } = require('express-jwt');
const http = require('http');
const router = require('./routes');
const { expLogger, logger } = require('./utils/logger');
const responseHelper = require('./utils/response_helper');
const { env } = require('./config');
const { CustomError, DbError, HttpError } = require('./error/error');
const { ERROR_CODE } = require('./error/error_code');

const app = express();
app.set('trust proxy', true);

app.use(express.json({
  type: [
    'application/json',
    'application/*+json',
  ],
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(expLogger);

app.use(expressjwt({
  secret: env.jwtSecret,
  algorithms: ['HS256'],
}).unless({
  path: [
    '/v1/login',
    '/v1/appVersion',
    '/v1/health',
    { url: /^\/v1\/webhook\/.*/ },
  ],
}));

router(app);

app.use((req, res, next) => {
  const err = new CustomError({
    message: `${env.app} can't resolve this: [${req.method}]${req.url}`,
    code: ERROR_CODE.NOT_FOUND,
  });
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    err.code = ERROR_CODE.UNAUTHORIZED;
  } else if (err instanceof DbError) {
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

  logger.error({
    level: 'error',
    path: req.baseUrl + req.path,
    message: `API Response[${err.code.http_status}]: ${JSON.stringify({
      code: err.code.code,
      message: err.message,
    })}`,
  });

  return responseHelper(res).fail(err);
});

module.exports = app;
const server = http.createServer(app);
const { port } = env;
server.listen(port, () => {
  logger.info(`http://localhost:${port}`);
});
