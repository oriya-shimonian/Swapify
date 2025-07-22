const express = require('express');
const { getStatistics } = require('../controllers/statisticsController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/" , authenticateUser, isAdmin, getStatistics);

module.exports = router;
