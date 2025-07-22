const express = require('express');
const router = express.Router();
const auditLogsController = require('../controllers/auditLogsController');

router.get('/', auditLogsController.getAuditLogs);

module.exports = router;