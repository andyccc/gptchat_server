module.exports = {

  /**
   * project
   */

  port: process.env.PORT || 9527,
  version: process.env.VERSION || 'v1.0.0',
  app: 'gptchat_server',
  mode: process.env.MODE,
  timeout: process.env.GATEWAY_TIMEOUT || 15000,

  salt: process.env.SALT,

  /**
   * log file
   */
  logFile: process.env.LOG_FILE_PATH,
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  logPrefix: 'gptchat',

  /**
   * jwt
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtTokenExpiry: process.env.JWT_TOKEN_EXPIRY,

  /**
   * mysql
   */
  master: {
    host: process.env.DB_MASTER_HOST,
    port: process.env.DB_MASTER_PORT,
    user: process.env.DB_MASTER_USER,
    password: process.env.DB_MASTER_PASSWORD,
    database: process.env.DB_MASTER_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 5,
    timezone: 'UTC',
  },
  slave: {
    host: process.env.DB_SLAVE_HOST,
    port: process.env.DB_SLAVE_PORT,
    user: process.env.DB_SLAVE_USER,
    password: process.env.DB_SLAVE_PASSWORD,
    database: process.env.DB_SLAVE_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 5,
    timezone: 'UTC',
  },

};
