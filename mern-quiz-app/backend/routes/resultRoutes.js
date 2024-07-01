// backend/routes/resultRoutes.js
const express = require('express');
const { createResult, getUserResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createResult).get(protect, getUserResults);

module.exports = router;
