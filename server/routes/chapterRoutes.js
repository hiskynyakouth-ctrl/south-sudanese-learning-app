const express = require('express');
const { getChapters, getChapter } = require('../controllers/chapterController');
const router = express.Router();

router.get('/:subjectId', getChapters);
router.get('/chapter/:id', getChapter);

module.exports = router;