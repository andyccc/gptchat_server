const multipart = require('connect-multiparty');

const multipartMiddleware = multipart();

module.exports = multipartMiddleware;
