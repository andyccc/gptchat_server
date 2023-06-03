/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const dateClient = require('../common/date_client');

// resolve parent path .env config
const configs = dotenv.parse(fs.readFileSync(path.join(__dirname, '../', '.env')));
Object.keys(configs).forEach((k) => {
  process.env[k] = configs[k];
});

// load config
const { env } = require('../config');
const { md5, isNotEmpty } = require('../utils/common');
const { logger } = require('../utils/logger');
const LiquibaseTS = require('liquibase').Liquibase;
const merchantService = require('../services/merchantService');

// read cmd param
const action = process.argv[2];
const changeLogFile = process.argv[3];
logger.info(` action ---> ${action}`);

// set mysql config
const mysqlConfig = {
  driver: 'com.mysql.jdbc.Driver',
  // driver : 'com.mysql.cj.jdbc.Driver', // 8.0 https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-api-changes.html
  classpath: './mysql-connector-java-5.1.49.jar',

  // env config
  url: `jdbc:mysql://${env.master.host}:${env.master.port}/${env.master.database}`,
  username: env.master.user,
  password: env.master.password,

  // dev
  // url: 'jdbc:mysql://192.168.50.8:3306/gptchat',
  // username: 'root',
  // password: 'citcon',

  // local
  // url: 'jdbc:mysql://localhost:3306/gptchat',
  // username: 'root',
  // password: 'citcon',

};

/**
 *
 * rollback:
 * 1、every changeset should has rollback tag
 * 2、rollback by tag
 *
 * update:
 * 1、when err comes, will stop last changeset
 * 2、err fixed, continue unsuccess changeset
 *
 * error:
 * 1、sometimes will appear detail info
 * 2、if sql syntax has err, only display syntax error info
 *
 * full update:
 * 1、if big static data, will run slowly
 * 2、need to wait sometime minutes, until console display finish
 *
 */

function createDir() {
  const localFolder = path.join(process.env.PWD, 'export');
  if (!fs.existsSync(localFolder)) {
    fs.mkdirSync(localFolder, { recursive: true });
  }
}

const LiquibaseCli = {
  generate: async (file) => {
    const dateTime = dateClient.dateTime();

    createDir();
    mysqlConfig.changeLogFile = isNotEmpty(file) ? file : `export/initial-schema-${dateTime}.mysql.xml`;
    const instTs = new LiquibaseTS(mysqlConfig);
    await instTs.generateChangeLog();
    logger.info('LiquibaseTS generate finish...');
  },

  update: async (file) => {
    mysqlConfig.changeLogFile = isNotEmpty(file) ? file : 'changeLog.master.xml';

    const instTs = new LiquibaseTS(mysqlConfig);

    const releaseLocks = await instTs.releaseLocks();
    logger.info(`releaseLocks: ${releaseLocks}`);

    // use current time as rollback tag
    const tag = dateClient.nowDateTime();
    await instTs.tag({ tag });

    try {
      await instTs.update();
    } catch (error) {
      logger.error(error);
      await instTs.rollback({ tag });
    }

    logger.info('LiquibaseTS update finish...');
  },

  fullupdate: async (file) => {
    mysqlConfig.changeLogFile = isNotEmpty(file) ? file : 'changeLog.master.xml';

    const instTs = new LiquibaseTS(mysqlConfig);

    const releaseLocks = await instTs.releaseLocks();
    logger.info(`releaseLocks: ${releaseLocks}`);

    await instTs.dropAll();
    // use current time as rollback tag
    const tag = dateClient.nowDateTime();
    await instTs.tag({ tag });

    try {
      await instTs.update();
    } catch (error) {
      logger.error(error);
      await instTs.rollback({ tag });
    }

    logger.info('LiquibaseTS fullupdate finish...');
  },

  status: async (file) => {
    mysqlConfig.changeLogFile = isNotEmpty(file) ? file : 'changeLog.master.xml';

    const instTs = new LiquibaseTS(mysqlConfig);
    await instTs.status();
    logger.info('LiquibaseTS status finish...');
  },

  generatedata: async (file) => {
    const dateTime = dateClient.dateTime();

    createDir();

    mysqlConfig.changeLogFile = isNotEmpty(file) ? file : `export/initial-schema-data-${dateTime}.mysql.xml`;
    mysqlConfig.diffTypes = 'catalog,tables,functions,views,columns,indexes,foreignkeys,primarykeys,uniqueconstraints,data,storedprocedure,triggers,sequences';
    const instTs = new LiquibaseTS(mysqlConfig);
    await instTs.generateChangeLog();
    logger.info('LiquibaseTS generate finish...');
  },

};

const runAction = async function run() {
  switch (action) {
    case 'generate':
      await LiquibaseCli.generate(changeLogFile);
      break;

    case 'generatedata':
      await LiquibaseCli.generatedata(changeLogFile);
      break;

    case 'update':
      await LiquibaseCli.update(changeLogFile);
      break;

    case 'update2':
      await LiquibaseCli.generatedata(changeLogFile);
      await LiquibaseCli.update(changeLogFile);
      break;

    case 'fullupdate':
      await LiquibaseCli.fullupdate(changeLogFile);
      break;

    case 'status':
      await LiquibaseCli.status(changeLogFile);
      break;

    default:
      logger.info('not action to do');
      break;
  }

  exit();
};

runAction();
