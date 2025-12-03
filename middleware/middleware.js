var jwt = require("jsonwebtoken");
const Authuser = require("../models/userSchema");
const requireAuth = (req, res, next) => {
  console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "shhhhh", (err) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "shhhhh",async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const loginUser=await Authuser.findById(decoded.id)
        res.locals.user = loginUser;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {requireAuth, checkIfUser};