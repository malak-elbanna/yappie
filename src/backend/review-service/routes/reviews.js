const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewController');

router.post('/', controller.createReview);
router.get('/:audiobookId', controller.getReviewsByContent);
router.get('/:audiobookId/summary', controller.getReviewSummary);

module.exports = router;
