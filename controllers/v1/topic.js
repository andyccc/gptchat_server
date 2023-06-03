/* eslint-disable camelcase */
const { forEach } = require('lodash');
const fetch = require('node-fetch');
const { logger } = require('../../utils/logger');
const questionService = require('../../services/questionService');
const topicService = require('../../services/topicService');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const topic = {

  sync: async (req, res, next) => {
    try {
      const { body = {} } = req;

      const questions = [];
      const tops = ['essay_assistant', 'translation', 'encyclopedia_knowledge', 'imagination', 'life_assistant', 'math_teacher', 'healthcare', 'travel_guide'];
      for (let index = 0; index < tops.length; index += 1) {
        const tid = tops[index];

        const tqs = [];
        for (let i = 0; i < 10; i += 1) {
          const url = `https://api-ai.particlethink.com/api/question/topic/question?topicId=${tid}`;
          const content = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'accept-language': 'zh-cn',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ5NDE5MjEsImlhdCI6MTY4NDY4MjcyMSwidWlkIjoyMDc0OH0.J2lPNytSIZYLCfFwpfHwI5dKzm-ugaMkAaBzxgb9P-Q',
            },
          };

          const response = await fetch(url, content);
          const result = await response.json();

          forEach(result.data.questions, (item) => {
            if (!tqs.includes(item)) {
              tqs.push(item);
            }
          });

          delay(1000);
          console.log(`开始执行第 ：${tid} -  ${i}`);
        }

        questions.push({
          topic_id: tid,
          tqs,
        });
      }

      if (questions.length > 0) {
        await Promise.all(questions.map(async (item) => {
          const { tqs, topic_id } = item;
          tqs.map(async (content) => {
            const question = {
              topic_id, content, language: 'zh-cn',
            };
            await questionService.saveQuestion(question);
          });
        }));
      }

      logger.info(`topic request ==> path: ${req.path}, body: ${JSON.stringify(body)}`);

      res.status(200).json(questions);
    } catch (e) {
      next(e);
    }
    return null;
  },

  inquire: async (req, res, next) => {
    try {
      const result = await topicService.getTopicList('zh-cn');
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },

};

module.exports = topic;
