const express = require('express');
const router = express.Router();
const { getAllStories, getStory, toggleBookmark } = require('../controllers/storyController');
const auth = require('../middleware/auth');

router.get('/', getAllStories);
router.get('/:id', getStory);
router.post('/:id/bookmark', auth, toggleBookmark);

module.exports = router;
