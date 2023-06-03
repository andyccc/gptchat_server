/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const async = require('async');
const { DbError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const { masterPool, slavePool } = require('../libs/mysql');

class daoBase {
  constructor() {
    this._pool = masterPool;
  }

  get master() {
    this._pool = masterPool;
    return this;
  }

  get slave() {
    this._pool = slavePool;
    return this;
  }

  get pool() {
    return this._pool;
  }

  execTrans(sqlparamsEntities, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        return callback(err, null);
      }
      connection.beginTransaction((error) => {
        if (error) {
          return callback(error, null);
        }

        const funcArr = [];
        Object.keys(sqlparamsEntities).forEach((sqlParam) => {
          // eslint-disable-next-line func-names
          const temp = function (cb) {
            const { sql, params } = sqlparamsEntities[sqlParam];
            connection.query(sql, params, (qErr, results) => {
              if (qErr) {
                return cb(qErr, 'err');
              }
              if (results.length === 0 || results.affectedRows === 0) {
                return cb(new DbError({ message: `sql error: ${sql}, params: ${JSON.stringify(params)}, results: ${results.length}, affectedRows: ${results.affectedRows}`, code: ERROR_CODE.INTERNAL_SERVER_ERROR }), 'err');
              }
              return cb(null, 'ok');
            });
          };
          funcArr.push(temp);
        });
        async.series(funcArr, (sErr, result) => {
          if (sErr) {
            connection.rollback(() => {
              connection.release();
              return callback(sErr, null);
            });
          } else {
            connection.commit((cErr) => {
              if (cErr) {
                connection.rollback(() => {
                  connection.release();
                  return callback(cErr, null);
                });
              } else {
                connection.release();
                return callback(null, result);
              }
            });
          }
        });
      });
    });
  }
}

module.exports = daoBase;
