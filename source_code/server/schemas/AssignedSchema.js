const mongoose = require("mongoose");

const AssignedSchema = new mongoose.Schema({
    user_story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserStory' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  

const Assigned = mongoose.model("Assigned", AssignedSchema);


module.exports = Assigned;