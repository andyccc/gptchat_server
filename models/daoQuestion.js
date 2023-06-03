const dbBase = require('./daoBase');
const { DbError, CustomError } = require('../error/error');
const { ERROR_CODE } = require('../error/error_code');
const { INSERT_QUESTION, FIND_QUESTION_LIST } = require('../sqls/question');

class DaoQuestion extends dbBase {
  saveQuestion(question) {
    return new Promise((resolve, reject) => {
      this.pool.query(INSERT_QUESTION, [
        question.topic_id, question.content, question.language,
      ], (err, results) => {
        if (err) {
          reject(new DbError({ message: err.message }));
        } else {
          resolve(results);
        }
      });
    });
  }

  getQuestionList(language) {
    return new Promise((resolve, reject) => {
      this.pool.query(FIND_QUESTION_LIST, [language], (err, results) => {
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

module.exports = new DaoQuestion();
