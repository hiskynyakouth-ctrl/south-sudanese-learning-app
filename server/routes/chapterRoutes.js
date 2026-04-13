const express = require('express');
const { getChapters, getChapter } = require('../controllers/chapterController');
const router = express.Router();

router.get('/chapter/:id', getChapter);
router.get('/:subjectId', getChapters);

module.exports = router;