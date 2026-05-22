const express = require('express');
const { getChaptersBySubject, getChapter } = require('../controllers/chapterController');
const router = express.Router();

router.get('/chapter/:id', getChapter);
router.get('/:subjectId', getChaptersBySubject);

module.exports = router;