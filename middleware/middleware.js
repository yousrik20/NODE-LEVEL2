var jwt = require("jsonwebtoken");

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

module.exports = requireAuth;