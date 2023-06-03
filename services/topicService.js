const daoTopic = require('../models/daoTopic');
const daoQuestion = require('../models/daoQuestion');

const topicService = {

  saveTopic: async (topic) => {
    await daoTopic.master.saveTopic(topic);
  },

  getTopicList: async (language) => {
    const topics = await daoTopic.master.getTopicList();
    const questions = await daoQuestion.slave.getQuestionList(language);

    const result = topics.map((item) => {
      const topic = {
        id: item.topic_id,
        name: language === 'en' ? item.name_en : item.name_cn,
        icon_url: item.icon_url,
      };
      topic.questions = [];
      questions.forEach((question) => {
        if (topic.id === question.topic_id) {
          topic.questions.push(question.content);
        }
      });
      return topic;
    });
    return result;
  },

};
module.exports = topicService;
