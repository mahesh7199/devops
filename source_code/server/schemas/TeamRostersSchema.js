const mongoose = require("mongoose");

const TeamRostersSchema = new mongoose.Schema({
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team" // This should be the model name you use for teams
    },
    member_id:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member" // This should be the model name you use for members
    }]
});

const TeamRoster = mongoose.model("TeamRoster", TeamRostersSchema);

module.exports = TeamRoster;
