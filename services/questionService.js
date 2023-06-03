const daoQuestion = require('../models/daoQuestion');

const questionService = {

  saveQuestion: async (question) => {
    await daoQuestion.master.saveQuestion(question);
  },

};
module.exports = questionService;
