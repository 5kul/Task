const Story = require('../models/Story');
const User = require('../models/User');

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ points: -1 });
    res.json(stories);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Not found' });
    res.json(story);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const storyId = req.params.id;
    const idx = user.bookmarks.findIndex(b => b.toString() === storyId);
    if (idx === -1) {
      user.bookmarks.push(storyId);
    } else {
      user.bookmarks.splice(idx, 1);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
