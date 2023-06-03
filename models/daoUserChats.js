/* eslint-disable camelcase */
const dbBase = require('./daoBase');
const { DbError } = require('../error/error');
const { INSERT_USER_CHAT } = require('../sqls/user_chats');

class DaoUserChats extends dbBase {
  saveUserChats(data) {
    return new Promise((resolve, reject) => {
      this.pool.query(INSERT_USER_CHAT, [
        data.user_id, data.platform, data.question, data.answer, data.ver,
      ], (err, results) => {
        if (err) {
          reject(new DbError({ message: err.message }));
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = new DaoUserChats();
