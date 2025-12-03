const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const authUserSchema = new Schema({
  username: String,
  email: String,
  password: String,
}); 



authUserSchema.pre("save", async function (next) {
 const salt = await bcrypt.genSalt();
 this.password = await bcrypt.hash(this.password, salt);
 next();
});
const AuthUser = mongoose.model("User", authUserSchema);

module.exports = AuthUser;