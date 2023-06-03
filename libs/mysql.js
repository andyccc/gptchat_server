/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const mysql = require('mysql');
const { env } = require('../config');
const { logger } = require('../utils/logger');

const clusterConfig = {
  removeNodeErrorCount: 1, // Remove the node immediately when connection fails.
  defaultSelector: 'RR',
  restoreNodeTimeout: 5000,
};

const poolCluster = mysql.createPoolCluster(clusterConfig);

// More instances can be added
poolCluster.add('MASTER', env.master);
poolCluster.add('SLAVE', env.slave);

const masterPool = poolCluster.of('MASTER', 'RR');
const slavePool = poolCluster.of('SLAVE', 'RR');

masterPool.getConnection((err, connection) => {
  if (err) {
    logger.error(err.message);
  } else {
    logger.info('Database connected masterPool successfully');
  }
});
slavePool.getConnection((err, connection) => {
  if (err) {
    logger.error(err.message);
  } else {
    logger.info('Database connected slavePool successfully');
  }
});

poolCluster.on('error', (err) => {
  logger.error('poolCluster fatal error %s', err.message);
});

poolCluster.on('remove', (nodeId) => {
  logger.info(`REMOVED NODE : ${nodeId}`);
});

const closeMysqlConnection = () => {
  logger.info('---------closeMysqlConnection-------');
  poolCluster.end(() => {
    // all connections in the pool cluster have ended
    // masterPool.disconnect();
    // slavePool.disconnect();
  });
};
module.exports = {
  masterPool,
  slavePool,
  closeMysqlConnection,
};
