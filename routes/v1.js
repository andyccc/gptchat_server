const express = require('express');

const router = express.Router();

const user = require('../controllers/v1/user');
const webhook = require('../controllers/v1/webhook');
const openai = require('../controllers/v1/openai');
const order = require('../controllers/v1/order');
const topic = require('../controllers/v1/topic');
const app = require('../controllers/v1/app');

// login
router.post('/login', user.login);
router.post('/chat/completions', openai.completions);

router.patch('/order/:order_id/:product_id', order.abandon);
router.post('/order', order.create);
router.post('/order/restore', order.restore);
router.put('/order', order.update);

router.get('/topic/sync', topic.sync);
router.get('/topic', topic.inquire);
router.get('/appVersion', app.index);
router.post('/webhook/appStore', webhook.appStore_v1);

module.exports = router;
