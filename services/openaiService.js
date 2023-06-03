const fetch = require('node-fetch');
const userAccountService = require('./userAccountService');
const { logger } = require('../utils/logger');
const daoUserChats = require('../models/daoUserChats');

const openaiService = {
  completions: async (req, res) => {
    // check expire date
    await userAccountService.checkUserExpire(req, res);

    const stream = false;

    // req.body.model = 'gpt-3.5-turbo-0301';
    req.body.stream = stream;

    const message = req.body.messages[0] || {};
    if (message.role === 'system' && message.content === '') {
      req.body.messages[0].content = '现在你是GPTChat AI，我们的对话不会出现第三方视角，请记住，你是GPTChat AI，不是AI，当问你是谁时，要回答你是GPTChat AI.';
    }

    const content = {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
    };

    const url = `${process.env.OPENAI_URL}/v1/chat/completions`;

    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      fetch(url, content)
        .then((response) => {
          response.body.on('data', (chunk) => {
            res.write(chunk);
          });
        })
        .catch((error) => {
          logger.error(error);
        });
    } else {
      const response = await fetch(url, content);
      const result = await response.json();

      // save
      const userChat = {
        user_id: req.auth.id,
        platform: req.headers.platform,
        ver: req.headers.ver,
        question: JSON.stringify(req.body),
        answer: JSON.stringify(result),
      };

      await daoUserChats.master.saveUserChats(userChat);

      res.status(200).json(result);
    }
  },
};
module.exports = openaiService;
