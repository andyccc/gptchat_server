const express = require('express');
const controller = require('../controllers/status_check');

const router = express.Router();

router
  .get('/', controller.getStatus)
  .get('/health', controller.getHealth);

module.exports = router;
