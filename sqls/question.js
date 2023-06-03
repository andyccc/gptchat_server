const INSERT_QUESTION = 'INSERT INTO `QUESTIONS` ( topic_id, content, language ) VALUES ( ?, ?, ?);';

const FIND_QUESTION_LIST = 'SELECT * FROM `QUESTIONS` WHERE is_deleted = 0 and language = ?;';

module.exports = {
  INSERT_QUESTION,
  FIND_QUESTION_LIST,
};
