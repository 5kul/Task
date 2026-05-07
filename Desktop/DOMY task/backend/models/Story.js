const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  author: { type: String },
  postedAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
