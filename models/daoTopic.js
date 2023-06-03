const dbBase = require('./daoBase');
const { DbError, CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const { INSERT_ORDER, FIND_TOPIC_LIST } = require('../sqls/topic');

class DaoTopic extends dbBase {
  saveTopic(topic) {
    return new Promise((resolve, reject) => {
      this.pool.query(INSERT_ORDER, [
        topic.name, topic.topic_id, topic.iconUrl,
      ], (err, results) => {
        if (err) {
          reject(new DbError({ message: err.message }));
        } else {
          resolve(results);
        }
      });
    });
  }

  getTopicList() {
    return new Promise((resolve, reject) => {
      this.pool.query(FIND_TOPIC_LIST, [], (err, results) => {
        if (err) {
          const error = new DbError({ message: err.message });
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = new DaoTopic();
