const INSERT_TOPIC = 'INSERT INTO `TOPICS` ( name_en, name_cn, topic_id, icon_url ) VALUES ( ?, ?, ? );';

const FIND_TOPIC_LIST = 'SELECT * FROM `TOPICS` WHERE is_deleted = 0;';

module.exports = {
  INSERT_TOPIC,
  FIND_TOPIC_LIST,

};
