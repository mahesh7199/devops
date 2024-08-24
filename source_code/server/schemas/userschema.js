const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String
}
);
const User = mongoose.model("User", userschema);

module.exports = User;