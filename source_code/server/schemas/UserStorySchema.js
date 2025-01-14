const mongoose = require('mongoose');

const UserStorySchema = new mongoose.Schema({
  user_story: String,
  proj_id: mongoose.Schema.Types.ObjectId,
  priority: {
    type: Number,
    default: 0,
  },
  isAssigned: { type: Boolean, default: false }
});

const UserStory = mongoose.model('UserStory', UserStorySchema);

module.exports = UserStory;



