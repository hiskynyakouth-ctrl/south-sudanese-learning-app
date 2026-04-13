const express = require('express');
const { getTextbooks, getTextbook } = require('../controllers/textbookController');
const router = express.Router();

router.get('/', getTextbooks);
router.get('/:id', getTextbook);

module.exports = router;
