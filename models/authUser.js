const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authUserSchema = new Schema({
  username: String,
  email: String,
  password: String,
}); 

const AuthUser = mongoose.model("User", authUserSchema);

module.exports = AuthUser;