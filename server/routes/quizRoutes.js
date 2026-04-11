const express = require('express');
const { getQuiz, submitQuiz } = require('../controllers/quizController');
const router = express.Router();

router.get('/:chapterId', getQuiz);
router.post('/:chapterId/submit', submitQuiz);

module.exports = router;