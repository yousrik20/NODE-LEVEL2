const Authuser = require("../models/Authuser");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");



const get_welcome=(req, res) => {
  res.render("welcome");
} 

const get_signout=(req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
}

const get_login=(req, res) => {
  res.render("auth/login");
}

const get_signup=(req, res) => {
  res.render("auth/signup");
}   

const post_signup= async (req, res) => {
    try {
      // check validation object for errors
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json({ arrValidationError: objError.errors });
      }
      // check if email already exists
      const isCurrentEmail = await Authuser.findOne({ email: req.body.email });
      console.log(isCurrentEmail);
      if (isCurrentEmail) {
        return res.json({ existEmail: "this email already used" });
      }
      // create new user and login
      const newUser = await Authuser.create(req.body);
      var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({ id: newUser._id });
    } catch (error) {
      console.log(error);
    }
  }

const post_login= async (req, res) => {
  try {
    const loginUser = await Authuser.findOne({ email: req.body.email });
    if (loginUser == null) {
      res.json({notFoundEmail: "this email is not found in DB"});
    } else {
      const match = await await bcrypt.compare(
        req.body.password,
        loginUser.password
      );
      if (match) {
        console.log("email found in DB & Password match status:", match);
        var token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({ id: loginUser._id });
      } else {
        res.json({ passwordError: "password is incorrect" });
      }
    }
  } catch (error) { 
    console.log(error);
  }
}




module.exports={get_welcome,get_signout,get_login,get_signup,post_signup,post_login};